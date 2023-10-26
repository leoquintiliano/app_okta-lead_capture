import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "../login.component";

const routes: Routes = [
  {path: 'list', component: LoginComponent},
  {path: 'find/:id', component: LoginComponent},
  {path: 'update/:id', component: LoginComponent},
  {path: 'create', component: LoginComponent},
  {path: 'delete/:id', component: LoginComponent},
  {path: '', component: LoginComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginRouteModule { }
