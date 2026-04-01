import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TodoItem } from '../data/todo.model';

interface TodoFormValue {
  name: string;
  description: string;
  closed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  readonly heading = input.required<string>();
  readonly headingIcon = input('add');
  readonly submitLabel = input('save');
  readonly showGuid = input(false);
  readonly showClosed = input(false);
  readonly isAdmin = input(false);
  readonly initialValue = input<Partial<TodoItem>>({});

  readonly saveClicked = output<TodoFormValue>();
  readonly cancelClicked = output<void>();
  private submitAttempted = false;

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    closed: new FormControl(false, { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });

  protected nameError(): string {
    const control = this.form.controls.name;
    if (!this.submitAttempted && !control.touched && !control.dirty) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Name is required';
    }

    if (control.hasError('minlength')) {
      return 'Name must have at least 3 characters';
    }

    return '';
  }

  protected descriptionError(): string {
    const control = this.form.controls.description;
    if (!this.submitAttempted && !control.touched && !control.dirty) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Description is required';
    }

    if (control.hasError('minlength')) {
      return 'Description must have at least 10 characters';
    }

    return '';
  }

  ngOnChanges(): void {
    this.submitAttempted = false;
    const value = this.initialValue();
    this.form.patchValue({
      name: value.name ?? '',
      description: value.description ?? '',
      closed: value.closed ?? false,
      active: value.active ?? true,
    });
  }

  submit(): void {
    this.submitAttempted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.saveClicked.emit(value);
  }

  protected updateClosedState(nextValue: 'open' | 'closed'): void {
    this.form.controls.closed.setValue(nextValue === 'closed');
  }
}

