import { TestBed } from '@angular/core/testing';
import axe from 'axe-core';
import { UpdateDialog } from './update-dialog';
import { VersionStore } from './version-store';

describe('UpdateDialog', () => {
  it('shows both versions, release notes and is accessible', async () => {
    await TestBed.configureTestingModule({ imports: [UpdateDialog] }).compileComponents();
    TestBed.inject(VersionStore).remote.set({ version: '9.9.9', releaseNotes: ['Yeni rapor ekranı'] });
    const fixture = TestBed.createComponent(UpdateDialog);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alertdialog"]')).toBeTruthy();
    expect(el.textContent).toContain('v9.9.9');
    expect(el.textContent).toContain('Yeni rapor ekranı');
    const result = await axe.run(el, { resultTypes: ['violations'], rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
  });
});
