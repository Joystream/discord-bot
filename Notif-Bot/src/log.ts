export function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

export function error(message: string, error?: any) {
  globalThis.consoleError(`[${new Date().toISOString()}] ${message}`, error);
}
