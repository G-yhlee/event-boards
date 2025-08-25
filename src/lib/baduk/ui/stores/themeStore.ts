import { writable } from 'svelte/store';

export type BoardTheme = 'modern' | 'baekje';

export const boardTheme = writable<BoardTheme>('modern');

export function toggleTheme() {
  boardTheme.update(current => current === 'modern' ? 'baekje' : 'modern');
}

export function setTheme(theme: BoardTheme) {
  boardTheme.set(theme);
}