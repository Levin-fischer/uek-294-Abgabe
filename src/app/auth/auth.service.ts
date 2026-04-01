import { effect, inject, Injectable, signal } from '@angular/core';
import Keycloak, { KeycloakLoginOptions, KeycloakLogoutOptions } from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  readonly authenticated = signal<boolean>(false);
  readonly profile = signal<Keycloak.KeycloakProfile | undefined>(undefined);
  readonly token = signal<string | undefined>(undefined);

  constructor() {
    effect(async () => {
        const keycloakEvent = this.keycloakSignal();

        if (keycloakEvent.type === KeycloakEventType.Ready) {
          const readyArgs = typeEventArgs<ReadyArgs>(keycloakEvent.args);
          if (readyArgs) {
            await this.keycloak.loadUserProfile();
            this.profile.set(this.keycloak.profile);
            this.token.set(this.keycloak.token);
          } else {
            this.profile.set(undefined);
            this.token.set(undefined);
          }
          this.authenticated.set(readyArgs);
        }

        if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
          this.authenticated.set(false);
        }
      }
    );
  }

  async login(keycloakLoginOptions: KeycloakLoginOptions | undefined = undefined) {
    await this.keycloak.login(keycloakLoginOptions);
  }

  async logout(keycloakLogoutOptions: KeycloakLogoutOptions | undefined = undefined) {
    await this.keycloak.logout(keycloakLogoutOptions);
  }

  isMemberOfRole(role: string) {
    const realmRole = this.keycloak.hasRealmRole(role);
    const resourceRole = this.keycloak.hasResourceRole(role);
    return realmRole || resourceRole;
  }
}
