import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "sign-in",
    title: "Inicio de sesión",
    loadComponent: () => import("./components/login/login.component").then(m => m.LoginComponent)
  },
  {
    path: "home",
    title: "Inicio",
    loadComponent: () => import("./components/dashboard/dashboard.component").then(m => m.DashboardComponent)
  },
  {
    path: "**",
    redirectTo: "404"
  },
  {
    path: "404",
    loadComponent: () => import("./components/not-found/not-found.component").then(m => m.NotFoundComponent)
  },
];
