import { error, log } from "./log";
import { getProposals, type Proposal } from "./proposals";
import { Database } from "bun:sqlite";

const DISCORD_WEBHOOK_URL = import.meta.env.DISCORD_WEBHOOK_URL;
const CHECK_INTERVAL =
  parseInt(import.meta.env.CHECK_INTERVAL_MINUTES || "15") * 60 * 1000;
const EXPIRY_THRESHOLD =
  parseInt(import.meta.env.EXPIRY_THRESHOLD_HOURS || "12") * 60 * 60;
const COUNCIL_ROLE_ID = import.meta.env.COUNCIL_ROLE_ID;

const db = new Database("data/notifications.db");

interface Notification {
  id: number;
  proposalId: string;
  type: "new" | "expiring";
  createdAt: Date;
  sent: boolean;
}

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proposalId TEXT NOT NULL,
      type TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent BOOLEAN DEFAULT 0
    )
  `);
}

async function checkProposals() {
  log(`Starting proposal check`);
  const proposals = await getProposals();

  for (const proposal of proposals) {
    // Check for new proposals
    const isNewProposal = await checkNewProposal(proposal.id);
    if (isNewProposal) {
      await createNotification(proposal.id, "new");
    }

    // Check for expiring proposals
    if (proposal.secondsUntilExpiry <= EXPIRY_THRESHOLD) {
      const isExpiringNotificationSent = await checkExpiringNotification(
        proposal.id
      );
      if (!isExpiringNotificationSent) {
        await createNotification(proposal.id, "expiring");
      }
    }
  }

  await sendNotifications(proposals);
  log(`Finished proposal check`);
}

function checkNewProposal(proposalId: string): boolean {
  const result = db
    .query('SELECT * FROM notifications WHERE proposalId = ? AND type = "new"')
    .get(proposalId);
  return !result;
}

function checkExpiringNotification(proposalId: string): boolean {
  const result = db
    .query(
      'SELECT * FROM notifications WHERE proposalId = ? AND type = "expiring"'
    )
    .get(proposalId);
  return !!result;
}

function createNotification(
  proposalId: string,
  type: "new" | "expiring"
): void {
  db.run("INSERT INTO notifications (proposalId, type) VALUES (?, ?)", [
    proposalId,
    type,
  ]);
}

async function sendNotifications(proposals: Proposal[]) {
  const notifications: Notification[] = db
    .query("SELECT * FROM notifications WHERE sent = 0")
    .all() as Notification[];

  for (const notification of notifications) {
    const proposal = proposals.find((p) => p.id === notification.proposalId);
    if (!proposal) continue;

    const embed = createDiscordEmbed(proposal, notification.type);
    log(
      `Sending ${notification.type} notification for proposal ${proposal.id}`
    );
    await sendDiscordNotification(embed);
    markNotificationAsSent(notification.id);
  }
}

function createDiscordEmbed(proposal: Proposal, type: "new" | "expiring") {
  const color = type === "new" ? 0x00ff00 : 0xff0000; // Green for new, Red for expiring
  const title =
    type === "new" ? "🆕 New Proposal Created" : "⏰ Proposal Expiring Soon";

  return {
    content: type === "expiring" ? `<@&${COUNCIL_ROLE_ID}>` : null,
    embeds: [
      {
        title: title,
        color: color,
        fields: [
          { name: "Title", value: proposal.title, inline: false },
          { name: "Creator", value: proposal.creator, inline: true },
          { name: "Type", value: proposal.type, inline: true },
          {
            name: "Expires In",
            value: formatTimeUntilExpiry(proposal.secondsUntilExpiry),
            inline: true,
          },
        ],
        footer: {
          text: `Proposal ID: ${proposal.id}`,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function formatTimeUntilExpiry(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

async function sendDiscordNotification(embed: any) {
  if (!DISCORD_WEBHOOK_URL) {
    error("Discord webhook URL not set");
    return;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embed),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    error("Failed to send Discord notification:", e);
  }
}

function markNotificationAsSent(notificationId: number): void {
  db.run("UPDATE notifications SET sent = 1 WHERE id = ?", [notificationId]);
}

export async function startNotificationService() {
  initDatabase();
  await checkProposals();
  setInterval(checkProposals, CHECK_INTERVAL);
  log("Notification service started");
}
