import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../auth/auth.service';
import { TodoRowComponent } from '../components/todo-row.component';
import { TodoHeaderComponent } from '../components/todo-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TodoDeleteDialogComponent } from '../components/todo-delete-dialog.component';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [
    TodoHeaderComponent,
    TodoRowComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './todo-list.page.html',
  styleUrl: './todo-list.page.scss',
})
export class TodoListPageComponent {
  protected readonly todoService = inject(TodoService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  protected readonly todos = computed(() => {
    const all = this.todoService.items();
    if (this.authService.isAdmin()) {
      return all;
    }

    return all.filter((todo) => todo.active);
  });

  async ngOnInit(): Promise<void> {
    await this.todoService.load(this.authService.isAdmin());
  }

  protected async refresh(): Promise<void> {
    await this.todoService.load(this.authService.isAdmin());
  }

  protected async toggleClosed(event: { id: string; checked: boolean }): Promise<void> {
    const updated = await this.todoService.toggleClosed(event.id, event.checked);
    if (!updated) {
      this.notificationService.error('Status konnte nicht aktualisiert werden.');
      return;
    }

    this.notificationService.success(
      event.checked ? 'Todo wurde als geschlossen markiert.' : 'Todo wurde wieder geoeffnet.',
    );
  }

  protected async remove(id: string): Promise<void> {
    if (!this.authService.isAdmin()) {
      return;
    }

    const todo = this.todoService.items().find((entry) => entry.id === id);
    if (!todo) {
      return;
    }

    const dialogRef = this.dialog.open(TodoDeleteDialogComponent, {
      width: '310px',
      data: { name: todo.name },
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) {
      return;
    }

    const removed = await this.todoService.remove(id);
    if (!removed) {
      this.notificationService.error('Todo konnte nicht geloescht werden.');
      return;
    }

    this.notificationService.success('Todo wurde geloescht.');
    await this.todoService.load(this.authService.isAdmin());
  }

  protected createNew(): void {
    void this.router.navigateByUrl('/todo/new');
  }
}

