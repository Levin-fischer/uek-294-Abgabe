import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private keycloak?: Keycloak;

  readonly initialized = signal(false);
  readonly authenticated = signal(false);
  readonly token = signal<string | undefined>(undefined);
  readonly username = signal<string | undefined>(undefined);
  readonly roles = signal<string[]>([]);

  readonly isAdmin = computed(() =>
    this.hasRole('Administrator', 'administrator', 'admin', 'Admin'),
  );

  constructor() {
    void this.init();
  }

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.initialized.set(true);
      return;
    }

    this.keycloak = new Keycloak({
      url: `http://localhost:38081`,
      realm: 'dev',
      clientId: 'client-app',
    });

    try {
      await this.keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        silentCheckSsoFallback: false,
        redirectUri: window.location.origin,
      });
    } finally {
      this.syncFromKeycloak();
      this.initialized.set(true);
    }
  }

  async login(redirectPath = '/todo/list'): Promise<void> {
    if (!this.keycloak) {
      return;
    }

    await this.keycloak.login({
      redirectUri: `${window.location.origin}${redirectPath}`,
    });
    this.syncFromKeycloak();
  }

  async logout(): Promise<void> {
    if (!this.keycloak) {
      return;
    }

    await this.keycloak.logout({
      redirectUri: `${window.location.origin}/home`,
    });
    this.syncFromKeycloak();
  }

  async getAccessToken(): Promise<string | undefined> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      this.syncFromKeycloak();
      return undefined;
    }

    try {
      await this.keycloak.updateToken(30);
    } catch {
      this.syncFromKeycloak();
      return undefined;
    }

    this.syncFromKeycloak();
    return this.token();
  }

  hasRole(...requiredRoles: string[]): boolean {
    if (!requiredRoles.length) {
      return false;
    }

    return requiredRoles.some((role) => this.roles().includes(role));
  }

  private syncFromKeycloak(): void {
    if (!this.keycloak) {
      this.authenticated.set(false);
      this.token.set(undefined);
      this.username.set(undefined);
      this.roles.set([]);
      return;
    }

    this.authenticated.set(this.keycloak.authenticated);
    this.token.set(this.keycloak.token);
    this.username.set(this.keycloak.tokenParsed?.['preferred_username'] as string | undefined);

    const realmRoles = this.keycloak.tokenParsed?.realm_access?.roles ?? [];
    const resourceAccess = this.keycloak.tokenParsed?.resource_access as
      | Record<string, { roles?: string[] }>
      | undefined;
    const resourceRoles = Object.values(resourceAccess ?? {}).flatMap(
      (resource) => resource.roles ?? [],
    );

    this.roles.set(Array.from(new Set([...realmRoles, ...resourceRoles])));
  }
}
