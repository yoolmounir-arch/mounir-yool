import { GeneratedContent } from "../types";

const STORAGE_KEY = "lesen_deutsch_history";

export function loadHistory(): GeneratedContent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
}

export function saveToHistory(item: GeneratedContent) {
  try {
    const history = loadHistory();
    const updated = [item, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save to history", e);
  }
}

export function deleteFromHistory(id: string) {
    try {
        const history = loadHistory();
        const updated = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to delete from history", e);
    }
}
