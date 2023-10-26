import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LeadComponent} from "./lead/lead.component";
import {LocalizacaoComponent} from "./localizacao/localizacao.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {AuthGuard} from "./guards/auth.guard";
import {LeadsComponent} from "./leads/leads.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'lead',
    component: LeadComponent,
    loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule),
    canActivate:[AuthGuard]
  },
  {
    path : 'localizacao',
    component: LocalizacaoComponent,
    loadChildren: () => import('./localizacao/localizacao.module').then(m => m.LocalizacaoModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule),
    canActivate:[AuthGuard]
  },
  {
    path:'login',
    component: LoginComponent,
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'leads',
    component: LeadsComponent,
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule),
    canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
