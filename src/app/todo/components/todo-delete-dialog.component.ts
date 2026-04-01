import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './todo-delete-dialog.component.html',
  styleUrl: './todo-delete-dialog.component.scss',
})
export class TodoDeleteDialogComponent {
  protected readonly data = inject<{ name: string }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TodoDeleteDialogComponent>);

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected confirm(): void {
    this.dialogRef.close(true);
  }
}

