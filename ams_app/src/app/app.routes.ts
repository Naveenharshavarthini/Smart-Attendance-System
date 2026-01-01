import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', canActivate: [AuthGuard],loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

];