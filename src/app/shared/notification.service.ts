import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.open(message, 'OK', 'app-snackbar-success');
  }

  error(message: string): void {
    this.open(message, 'Schliessen', 'app-snackbar-error', 5000);
  }

  info(message: string): void {
    this.open(message, 'OK', 'app-snackbar-info');
  }

  private open(
    message: string,
    action: string,
    panelClass: string,
    duration = 3500,
  ): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass,
    });
  }
}
