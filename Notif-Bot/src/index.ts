import { startNotificationService } from "./notificationService";

globalThis.consoleError = console.error;

// disable polkadot api logging
console.error = () => {};

// Start the notification service
startNotificationService();
