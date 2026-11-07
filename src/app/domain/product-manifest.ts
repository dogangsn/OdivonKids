export interface ProductManifest {
  readonly key: string;
  readonly name: string;
  readonly categoryKey: string;
  readonly taglineKey: string;
  readonly promiseKey: string;
  readonly apiNamespace: string;
  readonly accent: string;
}

export const PRODUCT: ProductManifest = {
  key: 'kids',
  name: 'OdivonKids',
  categoryKey: 'product.category',
  taglineKey: 'product.tagline',
  promiseKey: 'product.promise',
  apiNamespace: '/api/v1/kids',
  accent: '#7c3aed',
};
