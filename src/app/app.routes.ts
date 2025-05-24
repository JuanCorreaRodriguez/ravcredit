import {Routes} from '@angular/router';
import {permissionGuard} from './guards/permission.guard';

export const routes: Routes = [
  {
    path: "sign-in",
    title: "Inicio de sesión",
    loadComponent: () => import("./components/login/login.component").then(m => m.LoginComponent)
  },
  {
    path: "transfer-bank",
    title: "Transferencia (SPEI)",
    canActivate: [permissionGuard],
    loadComponent: () => import("./components/transfer-bank/transfer-bank.component").then(m => m.TransferBankComponent)
  },
  {
    path: "reference/conekta",
    title: "Referencia Conekta",
    canActivate: [permissionGuard],
    loadComponent: () => import("./components/reference-conekta/reference-conekta.component").then(m => m.ReferenceConektaComponent)
  },
  {
    path: "reference/dynamicore",
    title: "Referencia DynamiCore",
    canActivate: [permissionGuard],
    loadComponent: () => import("./components/reference-dynamic/reference-dynamic.component").then(m => m.ReferenceDynamicComponent)
  },
  {
    path: "dashboard",
    title: "Inicio",
    canActivate: [permissionGuard],
    loadComponent: () => import("./components/dashboard/dashboard.component").then(m => m.DashboardComponent)
  },
  {
    path: "payment-detail",
    title: "Información de pago",
    canActivate: [permissionGuard],
    loadComponent: () => import("./components/payments/payment-detail/payment-detail.component").then(m => m.PaymentDetailComponent)
  },
  {
    path: "",
    title: "Inicio",
    canActivate: [permissionGuard],
    outlet: "secondOutlet",
    loadComponent: () => import("./components/dashboard/dashboard.component").then(m => m.DashboardComponent)
  },
  // {
  //   path: "**",
  //   redirectTo: "404"
  // },
  // {
  //   path: "404",
  //   loadComponent: () => import("./components/not-found/not-found.component").then(m => m.NotFoundComponent)
  // },
];
