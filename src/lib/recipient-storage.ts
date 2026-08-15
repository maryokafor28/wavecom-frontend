const RECIPIENT_ID_KEY = "wavecom_recipient_id";
const GUEST_MODE_KEY = "wavecom_guest_mode";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredRecipientId(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(RECIPIENT_ID_KEY);
  } catch (error) {
    console.error("failed to read recipient ID from local storage", error);
    return null;
  }
}

export function setStoredRecipientId(id: string): void {
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

export function getGuestMode(): boolean {
  if (!isBrowser()) return false;

  try {
    return window.localStorage.getItem(GUEST_MODE_KEY) === "true";
  } catch (error) {
    console.error("Failed to read guest mode from localStorage", error);
    return false;
  }
}

export function setGuestMode(value: boolean): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(GUEST_MODE_KEY, String(value));
  } catch (error) {
    console.error("Failed to save guest mode to localStorage", error);
  }
}
export function clearAllIdentification(): void {
  clearStoredRecipientId();
  setGuestMode(false);
}
