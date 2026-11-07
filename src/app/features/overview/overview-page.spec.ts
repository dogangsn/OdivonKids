import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import axe from 'axe-core';
import { OverviewPage } from './overview-page';

describe('OverviewPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OverviewPage], providers: [provideRouter([])] });
  });

  it('shows readiness computed from the product data', async () => {
    const fixture = TestBed.createComponent(OverviewPage);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Ürün hazırlık matrisi');
    expect(text).toContain('Pazara hazır');
    expect(text).not.toMatch(/gaz|teknisyen|ekipman/i);
    const kpi = fixture.componentInstance.kpi();
    expect(kpi.total).toBe(5);
    expect(kpi.ready).toBe(1);
    expect(kpi.blocked).toBe(2);
  });

  it('has no critical or serious AXE violations', async () => {
    const fixture = TestBed.createComponent(OverviewPage);
    await fixture.whenStable();
    const result = await axe.run(fixture.nativeElement as HTMLElement, {
      resultTypes: ['violations'],
      rules: { 'color-contrast': { enabled: false } },
    });
    const blocking = result.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(blocking).toEqual([]);
  });
});
