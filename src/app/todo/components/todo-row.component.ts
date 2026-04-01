import { Component, input, output } from '@angular/core';
import { TodoItem } from '../data/todo.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo-row',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './todo-row.component.html',
  styleUrl: './todo-row.component.scss',
})
export class TodoRowComponent {
  readonly todo = input.required<TodoItem>();
  readonly index = input.required<number>();
  readonly isAdmin = input(false);

  readonly closedChanged = output<{ id: string; checked: boolean }>();
  readonly deleteClicked = output<string>();
}

