import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TodoFormComponent } from '../components/todo-form.component';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../auth/auth.service';
import { TodoCreateDto } from '../../../api-gen/todo/models/todo-create-dto';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-todo-new-page',
  standalone: true,
  imports: [TodoFormComponent],
  templateUrl: './todo-new.page.html',
})
export class TodoNewPageComponent {
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly authService = inject(AuthService);

  protected async save(value: {
    name: string;
    description: string;
    closed: boolean;
    active: boolean;
  }): Promise<void> {
    const dto: TodoCreateDto = {
      guid: crypto.randomUUID(),
      name: value.name,
      description: value.description,
    };
    const created = await this.todoService.create(dto);
    if (!created) {
      this.notificationService.error('Todo konnte nicht erstellt werden.');
      return;
    }

    this.notificationService.success('Todo wurde erstellt.');
    await this.todoService.load(this.authService.isAdmin());
    await this.router.navigateByUrl('/todo/list');
  }

  protected cancel(): void {
    void this.router.navigateByUrl('/todo/list');
  }
}

