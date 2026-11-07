import { describe, expect, it } from 'vitest';
import {
  ComplianceRecord,
  addDays,
  areaStatus,
  readinessPercent,
  readinessState,
} from './kids-catalog';

const rec = (over: Partial<ComplianceRecord>): ComplianceRecord => ({
  id: 'x',
  productId: 'p',
  area: 'test-reports',
  title: 't',
  reference: 'r',
  detail: 'd',
  status: 'approved',
  updated: addDays(0),
  ...over,
});

describe('readiness rules', () => {
  it('treats an area without records as missing', () => {
    expect(areaStatus([])).toBe('missing');
  });

  it('marks a past validity date as expired even if approved', () => {
    expect(areaStatus([rec({ validUntil: addDays(-1) })])).toBe('expired');
  });

  it('uses the worst record status for the area', () => {
    expect(areaStatus([rec({}), rec({ status: 'review' })])).toBe('review');
    expect(areaStatus([rec({ status: 'review' }), rec({ status: 'rejected' })])).toBe('rejected');
  });

  it('derives product state from the four areas', () => {
    expect(readinessState(['approved', 'approved', 'approved', 'approved'])).toBe('ready');
    expect(readinessState(['approved', 'missing', 'review', 'approved'])).toBe('incomplete');
    expect(readinessState(['approved', 'expired', 'approved', 'approved'])).toBe('blocked');
    expect(readinessPercent(['approved', 'missing', 'approved', 'review'])).toBe(50);
  });
});
