import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { ActivePatchDto } from '../../../api-gen/todo';
import { TodoCreateDto } from '../../../api-gen/todo';
import { TodoReturnDto } from '../../../api-gen/todo';
import { TodoItem } from './todo.model';

interface TodoUpdatePayload {
  name: string;
  description: string;
  closed: boolean;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/todo/data';
  private readonly adminApiUrl = '/api/todo/admin';

  readonly items = signal<TodoItem[]>([]);
  readonly loading = signal(false);

  async load(showAll = false): Promise<void> {
    this.loading.set(true);

    try {
      const items = await firstValueFrom(
        this.http.get<TodoReturnDto[]>(this.apiUrl, { params: { showAll } }).pipe(
          map((todos) => todos.map((todo) => this.toTodoItem(todo))),
          catchError(() => of(this.items())),
        ),
      );
      this.items.set(items);
    } finally {
      this.loading.set(false);
    }
  }

  async byId(id: string, showAll = false): Promise<TodoItem | undefined> {
    const local = this.items().find((item) => item.id === id);
    if (local) {
      return local;
    }

    return firstValueFrom(
      this.http.get<TodoReturnDto>(`${this.apiUrl}/${id}`, { params: { showAll } }).pipe(
        map((item) => (item ? this.toTodoItem(item) : undefined)),
        catchError(() => of(undefined)),
      ),
    );
  }

  async create(dto: TodoCreateDto): Promise<boolean> {
    const previous = this.items();
    const optimistic: TodoItem = {
      id: dto.guid,
      name: dto.name,
      description: dto.description,
      closed: false,
      active: true,
    };
    const next = [...this.items(), optimistic];
    this.items.set(next);

    const created = await firstValueFrom(
      this.http.post<TodoReturnDto>(this.apiUrl, dto).pipe(catchError(() => of(undefined))),
    );

    if (!created) {
      this.items.set(previous);
      return false;
    }

    this.replaceLocal(this.toTodoItem(created));
    return true;
  }

  async update(id: string, dto: TodoUpdatePayload): Promise<boolean> {
    const previous = this.items();
    const current = this.items().find((item) => item.id === id);
    const next = this.items().map((item) => (item.id === id ? { ...item, ...dto } : item));
    this.items.set(next);

    const body: TodoReturnDto = {
      guid: id,
      name: dto.name,
      description: dto.description,
      state: dto.closed ? 'closed' : 'open',
      active: current?.active ?? dto.active,
    };

    const updated = await firstValueFrom(
      this.http.put<TodoReturnDto>(`${this.apiUrl}/${id}`, body).pipe(catchError(() => of(undefined))),
    );

    if (!updated) {
      this.items.set(previous);
      return false;
    }

    this.replaceLocal({
      ...this.toTodoItem(updated),
      active: current?.active ?? updated.active,
    });
    return true;
  }

  async toggleClosed(id: string, closed: boolean): Promise<boolean> {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) {
      return false;
    }

    return this.update(id, {
      name: item.name,
      description: item.description,
      closed,
      active: item.active,
    });
  }

  async toggleActive(id: string, active: boolean): Promise<boolean> {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) {
      return false;
    }

    const previous = this.items();
    const next = this.items().map((entry) => (entry.id === id ? { ...entry, active } : entry));
    this.items.set(next);

    const body: ActivePatchDto = { active };
    const updated = await firstValueFrom(
      this.http.patch<TodoReturnDto>(`${this.adminApiUrl}/${id}`, body).pipe(catchError(() => of(undefined))),
    );

    if (!updated) {
      this.items.set(previous);
      return false;
    }

    this.replaceLocal(this.toTodoItem(updated));
    return true;
  }

  async remove(id: string): Promise<boolean> {
    const previous = this.items();
    this.items.set(this.items().filter((item) => item.id !== id));

    const deleted = await firstValueFrom(
      this.http
        .delete<TodoReturnDto>(`${this.adminApiUrl}/${id}`)
        .pipe(catchError(() => of(undefined))),
    );

    if (deleted === undefined) {
      this.items.set(previous);
      return false;
    }

    return true;
  }

  private toTodoItem(todo: TodoReturnDto): TodoItem {
    return {
      id: todo.guid,
      name: todo.name,
      description: todo.description,
      closed: todo.state === 'closed',
      active: todo.active,
    };
  }

  private replaceLocal(todo: TodoItem): void {
    const others = this.items().filter((item) => item.id !== todo.id);
    this.items.set([...others, todo]);
  }
}

