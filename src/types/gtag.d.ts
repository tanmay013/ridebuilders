export {};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
