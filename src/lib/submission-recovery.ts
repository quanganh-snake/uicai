import type { PaperSubmissionFormData } from "@/lib/validations/submission";

const DATABASE_NAME = "icai-submission-recovery";
const DATABASE_VERSION = 1;
const DRAFT_STORE = "drafts";
const DRAFT_KEY = "paper-submission";
const RECOVERY_MARKER_KEY = "icai.paper-submission-recovery";
const RECOVERY_MAX_AGE_MS = 60 * 60 * 1000;

export const SUBMISSION_PATH = "/aiesi-2027/join";
export const SUBMISSION_RECOVERY_LOGIN_PATH =
  "/auth/login?recoverSubmission=1&sessionExpired=1";

interface SubmissionDraft {
  fields: PaperSubmissionFormData;
  files: File[];
  savedAt: number;
}

interface RecoveryMarker {
  phase: "awaiting-login" | "authenticated";
  savedAt: number;
}

function readMarker(): RecoveryMarker | null {
  if (typeof window === "undefined") return null;

  try {
    const marker = JSON.parse(
      window.sessionStorage.getItem(RECOVERY_MARKER_KEY) ?? "null",
    ) as Partial<RecoveryMarker> | null;

    if (
      !marker ||
      (marker.phase !== "awaiting-login" && marker.phase !== "authenticated") ||
      typeof marker.savedAt !== "number" ||
      Date.now() - marker.savedAt > RECOVERY_MAX_AGE_MS
    ) {
      window.sessionStorage.removeItem(RECOVERY_MARKER_KEY);
      void deleteStoredDraft().catch(() => undefined);
      return null;
    }

    return marker as RecoveryMarker;
  } catch {
    window.sessionStorage.removeItem(RECOVERY_MARKER_KEY);
    void deleteStoredDraft().catch(() => undefined);
    return null;
  }
}

function writeMarker(marker: RecoveryMarker) {
  window.sessionStorage.setItem(RECOVERY_MARKER_KEY, JSON.stringify(marker));
}

function openDraftDatabase() {
  const { promise, resolve, reject } = Promise.withResolvers<IDBDatabase>();
  const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(DRAFT_STORE)) {
      database.createObjectStore(DRAFT_STORE);
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);

  return promise;
}

async function runDraftRequest<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDraftDatabase();

  try {
    const { promise, resolve, reject } = Promise.withResolvers<T>();
    const transaction = database.transaction(DRAFT_STORE, mode);
    const request = operation(transaction.objectStore(DRAFT_STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onabort = () => reject(transaction.error);
    return await promise;
  } finally {
    database.close();
  }
}

function deleteStoredDraft() {
  return runDraftRequest("readwrite", (store) => store.delete(DRAFT_KEY));
}

export async function saveSubmissionDraft(
  fields: PaperSubmissionFormData,
  files: File[],
) {
  const savedAt = Date.now();
  const draft: SubmissionDraft = { fields, files, savedAt };

  await runDraftRequest("readwrite", (store) => store.put(draft, DRAFT_KEY));
  writeMarker({ phase: "awaiting-login", savedAt });
}

export function hasPendingSubmissionRecovery() {
  return readMarker()?.phase === "awaiting-login";
}

export function markSubmissionRecoveryAuthenticated() {
  const marker = readMarker();
  if (!marker || marker.phase !== "awaiting-login") return false;

  writeMarker({ ...marker, phase: "authenticated" });
  return true;
}

export async function loadAuthenticatedSubmissionDraft() {
  const marker = readMarker();
  if (!marker || marker.phase !== "authenticated") return null;

  const draft = await runDraftRequest<SubmissionDraft | undefined>(
    "readonly",
    (store) => store.get(DRAFT_KEY),
  );

  if (!draft || draft.savedAt !== marker.savedAt) {
    await clearSubmissionDraft();
    return null;
  }

  return draft;
}

export async function clearSubmissionDraft() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(RECOVERY_MARKER_KEY);
  await deleteStoredDraft();
}
