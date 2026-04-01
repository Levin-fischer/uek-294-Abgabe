import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { TodoCreateDto, TodoItem, TodoUpdateDto } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/todos';

  readonly items = signal<TodoItem[]>([]);
  readonly loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);

    try {
      const items = await firstValueFrom(
        this.http.get<TodoItem[]>(this.apiUrl).pipe(
          catchError(() => of(this.items())),
        ),
      );
      this.items.set(items);
    } finally {
      this.loading.set(false);
    }
  }

  async byId(id: string): Promise<TodoItem | undefined> {
    const local = this.items().find((item) => item.id === id);
    if (local) {
      return local;
    }

    return firstValueFrom(
      this.http.get<TodoItem>(`${this.apiUrl}/${id}`).pipe(
        map((item) => item ?? undefined),
        catchError(() => of(undefined)),
      ),
    );
  }

  async create(dto: TodoCreateDto): Promise<void> {
    const next = [...this.items(), { ...dto, closed: false } satisfies TodoItem];
    this.items.set(next);

    await firstValueFrom(
      this.http.post<TodoItem>(this.apiUrl, dto).pipe(catchError(() => of(undefined))),
    );
  }

  async update(id: string, dto: TodoUpdateDto): Promise<void> {
    const next = this.items().map((item) => (item.id === id ? { ...item, ...dto } : item));
    this.items.set(next);

    await firstValueFrom(
      this.http.patch<TodoItem>(`${this.apiUrl}/${id}`, dto).pipe(catchError(() => of(undefined))),
    );
  }

  async toggleClosed(id: string, closed: boolean): Promise<void> {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    await this.update(id, {
      name: item.name,
      description: item.description,
      closed,
      active: item.active,
    });
  }

  async toggleActive(id: string, active: boolean): Promise<void> {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    await this.update(id, {
      name: item.name,
      description: item.description,
      closed: item.closed,
      active,
    });
  }

  async remove(id: string): Promise<void> {
    this.items.set(this.items().filter((item) => item.id !== id));

    await firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(() => of(undefined))),
    );
  }
}

