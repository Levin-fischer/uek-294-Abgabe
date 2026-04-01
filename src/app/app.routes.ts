import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

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
    loadComponent: () =>
      import('./todo/pages/todo-list.page').then((m) => m.TodoListPageComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
