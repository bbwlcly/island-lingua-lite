export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) {
    return;
  }

  window.addEventListener("load", () => {
    const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(serviceWorkerUrl).catch((error: unknown) => {
      console.info("Service worker registration skipped.", error);
    });
  });
}
