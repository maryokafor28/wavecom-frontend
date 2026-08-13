const RECIPIENT_ID_KEY = "wavecom_recipient_id";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStorageRecipientId(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(RECIPIENT_ID_KEY);
  } catch (error) {
    console.error("failed to read recipient ID from local storage", error);
    return null;
  }
}

export function setStorageRecipientId(id: string): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(RECIPIENT_ID_KEY, id);
  } catch (error) {
    console.error("failed to save recipeint ID to localstorage", error);
  }
}

export function clearStoredRecipientId(): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(RECIPIENT_ID_KEY);
  } catch (error) {
    console.error("failed to clear recipient Id from localStorage", error);
  }
}
