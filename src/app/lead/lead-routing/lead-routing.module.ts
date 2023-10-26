import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LeadComponent} from "../lead.component";

const routes: Routes = [
  {path: 'list', component: LeadComponent},
  {path: 'detail/:id', component: LeadComponent},
  {path: 'update/:id', component: LeadComponent},
  {path: 'save', component: LeadComponent},
  {path: 'delete', component: LeadComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class LeadRoutingModule { }
