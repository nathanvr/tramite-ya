import { Routes } from '@angular/router';
import { authGuard } from './_helpers/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (login) => login.LoginComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main-layout/main-layout.component').then(
        (main) => main.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   loadComponent: () =>
      //     import('./pages/dashboard/dashboard.component').then(
      //       (dashboard) => dashboard.DashboardComponent
      //     ),
      // },
      // {
      //   path: 'tasks',
      //   loadComponent: () =>
      //     import('./components/tasks/tasks.component').then(
      //       (tasks) => tasks.TasksComponent
      //     ),
      // },
      // {
      //   path: 'reports',
      //   children: [
      //     {
      //       path: 'tasks-list',
      //       loadComponent: () =>
      //         import('./pages/task-list/task-list.component').then(
      //           (tasksList) => tasksList.TaskListComponent
      //         ),
      //     },
      //     {
      //       path: 'screenshot-report',
      //       loadComponent: () =>
      //         import(
      //           './pages/screenshot-report/screenshot-report.component'
      //         ).then(
      //           (screenshotReport) => screenshotReport.ScreenshotReportComponent
      //         ),
      //     },
      //   ],
      // },
    ],
  },
];
