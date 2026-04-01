import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbar, MatButton, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  goToHome() {
    void this.router.navigateByUrl('/home');
  }

  goToTodo() {
    void this.router.navigateByUrl('/todo/list');
  }

  authShortcut() {
    if (this.authService.authenticated()) {
      void this.logout();
      return;
    }

    void this.login();
  }

  login() {
    void this.authService.login('/home');
  }

  async logout() {
    await this.router.navigateByUrl('/home');
    await this.authService.logout();
  }
}
