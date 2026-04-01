import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { inactiveTodoGuard } from './todo/guards/inactive-todo.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'todo',
    pathMatch: 'full',
    redirectTo: 'todo/list',
  },
  {
    path: 'todo/list',
    canActivate: [authGuard],
    loadComponent: () => import('./todo/pages/todo-list.page').then((m) => m.TodoListPageComponent),
  },
  {
    path: 'todo/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./todo/pages/todo-new.page').then((m) => m.TodoNewPageComponent),
  },
  {
    path: 'todo/edit/:id',
    canActivate: [authGuard, inactiveTodoGuard],
    loadComponent: () =>
      import('./todo/pages/todo-edit.page').then((m) => m.TodoEditPageComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
