import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    //Das sollte zu unterst stehen, damit die anderen Routen zuerst geprüft werden. Ich sött nöd vergässe das nachher ahpasse
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
