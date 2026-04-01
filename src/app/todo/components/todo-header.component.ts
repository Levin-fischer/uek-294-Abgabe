import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './todo-header.component.html',
  styleUrl: './todo-header.component.scss',
})
export class TodoHeaderComponent {
  readonly title = input('Todos');
}

