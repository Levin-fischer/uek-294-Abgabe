import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MatToolbar, MatIcon, MatButton],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  protected readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected authenticated = this.authService.authenticated;
  protected username = this.authService.username;

  login() {
    void this.authService.login();
  }

  async logout() {
    await this.router.navigateByUrl('/');
    await this.authService.logout();
  }
}
