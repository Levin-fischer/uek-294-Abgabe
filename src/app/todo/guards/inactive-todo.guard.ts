import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../auth/auth.service';

export const inactiveTodoGuard: CanActivateFn = async (route) => {
  const id = route.paramMap.get('id');
  const router = inject(Router);
  const todoService = inject(TodoService);
  const authService = inject(AuthService);

  if (!id) {
    return router.createUrlTree(['/todo/list']);
  }

  const todo = await todoService.byId(id, authService.isAdmin());
  if (!todo) {
    return router.createUrlTree(['/todo/list']);
  }

  if (!todo.active && !authService.isAdmin()) {
    return router.createUrlTree(['/todo/list']);
  }

  return true;
};

