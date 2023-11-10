import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guard/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routing').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
