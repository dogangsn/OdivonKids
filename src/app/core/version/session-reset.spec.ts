import { afterEach, describe, expect, it } from 'vitest';
import { clearCookies, clearSessionData, clearWebStorage } from './session-reset';

describe('session reset', () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('removes cookies', () => {
    document.cookie = 'odivon_session=abc; path=/';
    document.cookie = 'other=1; path=/';
    clearCookies();
    expect(document.cookie).toBe('');
  });

  it('clears storage but keeps theme and language', () => {
    localStorage.setItem('odivon:session', '{"email":"a@b.c"}');
    localStorage.setItem('odivon:theme', 'dark');
    localStorage.setItem('odivon:preferred_lang', 'en');
    sessionStorage.setItem('temp', '1');
    clearWebStorage();
    expect(localStorage.getItem('odivon:session')).toBeNull();
    expect(localStorage.getItem('odivon:theme')).toBe('dark');
    expect(localStorage.getItem('odivon:preferred_lang')).toBe('en');
    expect(sessionStorage.length).toBe(0);
  });

  it('completes a full reset', async () => {
    localStorage.setItem('odivon:session', '{}');
    await clearSessionData();
    expect(localStorage.getItem('odivon:session')).toBeNull();
  });
});
