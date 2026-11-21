import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'sleep',
        loadComponent: () => import('./sleep/sleep.page').then((m) => m.SleepPage),
      },
      {
        path: 'logs',
        loadComponent: () => import('./logs/logs.page').then((m) => m.LogsPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'session',
    loadComponent: () => import('./session/session.page').then( m => m.SessionPage)
  },
];