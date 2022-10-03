const registerServiceWorker = async () => {
  if (!navigator.serviceWorker) return;
  try {
    await navigator.serviceWorker.register('./service-worker.js', { type: "module" });
    console.log('Service Worker Registered');
  } catch (error) {
    console.log('Service Worker Registration Failed', error);
  }
}

registerServiceWorker()