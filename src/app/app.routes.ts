import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AREAS } from './domain/domain-navigation';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth-page').then((m) => m.AuthPage),
    data: { mode: 'login' },
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/auth-page').then((m) => m.AuthPage),
    data: { mode: 'register' },
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell').then((m) => m.AppShell),
    children: [
      {
        path: 'overview',
        title: 'Genel Bakış · OdivonKids',
        loadComponent: () =>
          import('./features/overview/overview-page').then((m) => m.OverviewPage),
      },
      {
        path: 'products',
        title: 'Ürün Kataloğu · OdivonKids',
        loadComponent: () =>
          import('./features/products/products-page').then((m) => m.ProductsPage),
      },
      ...AREAS.map((area) => ({
        path: area.path,
        title: `${area.label} · OdivonKids`,
        loadComponent: () =>
          import('./features/compliance/compliance-page').then((m) => m.CompliancePage),
        data: { section: area.key },
      })),
      {
        path: 'activity',
        title: 'Aktiviteler · OdivonKids',
        loadComponent: () =>
          import('./features/activity/activity-page').then((m) => m.ActivityPage),
      },
      {
        path: 'settings',
        title: 'Ayarlar · OdivonKids',
        loadComponent: () =>
          import('./features/settings/settings-page').then((m) => m.SettingsPage),
      },
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
    ],
  },
  { path: '**', redirectTo: '' },
];
