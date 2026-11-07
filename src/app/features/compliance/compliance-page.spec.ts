import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { KidsStore } from '../../domain/kids-store';
import { CompliancePage } from './compliance-page';

function setup(query: Record<string, string> = {}) {
  TestBed.configureTestingModule({
    imports: [CompliancePage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { data: { section: 'test-reports' }, queryParamMap: convertToParamMap(query) },
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(CompliancePage);
  return { fixture, page: fixture.componentInstance, store: TestBed.inject(KidsStore) };
}

describe('CompliancePage', () => {
  it('renders the area with its own columns', async () => {
    const { fixture } = setup();
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Güvenlik Test Raporları');
    expect(text).toContain('Rapor numarası');
    expect(text).toContain('Geçerlilik');
    expect(text).not.toContain('Lokasyon');
  });

  it('edits a record in place instead of creating a duplicate', async () => {
    const { page, store } = setup();
    const target = store.records().find((r) => r.area === 'test-reports')!;
    const before = store.records().length;
    page.openEdit(target);
    page.draft.update((v) => ({ ...v, reference: 'NEW-REF-1' }));
    page.save();
    await Promise.resolve();
    expect(store.records().length).toBe(before);
    expect(store.records().find((r) => r.id === target.id)?.reference).toBe('NEW-REF-1');
  });

  it('adds a record for a missing product and makes it count for readiness', async () => {
    const { page, store } = setup({ new: '1', product: 'p5' });
    expect(page.drawerOpen()).toBe(true);
    expect(page.draft().productId).toBe('p5');
    page.draft.update((v) => ({
      ...v,
      title: 'Yeni test',
      reference: 'LAB-1',
      validUntil: '2099-01-01',
      status: 'approved',
    }));
    const before = store.records().length;
    page.save();
    await Promise.resolve();
    expect(store.records().length).toBe(before + 1);
  });

  it('flags products with no record in the area', () => {
    const { page } = setup();
    expect(page.summary().missingProducts.map((p) => p.id)).toEqual([]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CompliancePage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { section: 'traceability' }, queryParamMap: convertToParamMap({}) },
          },
        },
      ],
    });
    const other = TestBed.createComponent(CompliancePage).componentInstance;
    expect(other.summary().missingProducts.map((p) => p.id)).toEqual(['p3', 'p4']);
  });
});
