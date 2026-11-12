import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { LandingPage } from './landing-page';

describe('LandingPage', () => {
  beforeEach(async () => {
    localStorage.removeItem('odivon:session');
    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('is the public root route', () => {
    const root = routes.find((r) => r.path === '' && r.pathMatch === 'full');
    expect(root?.canActivate).toBeUndefined();
    expect(root?.loadComponent).toBeDefined();
  });

  it('offers sign-in and sign-up to visitors', async () => {
    const fixture = TestBed.createComponent(LandingPage);
    await fixture.whenStable();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a[href]'),
    ).map((a) => a.getAttribute('href'));
    expect(links).toContain('/login');
    expect(links).toContain('/register');
  });
});
