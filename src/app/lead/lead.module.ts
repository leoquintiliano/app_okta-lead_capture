import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadComponent } from './lead.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LeadRoutingModule} from "./lead-routing/lead-routing.module";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSortModule} from "@angular/material/sort";



@NgModule({
  declarations: [
    LeadComponent
  ],
  exports: [
    LeadComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        LeadRoutingModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        MatToolbarModule,
        MatSortModule,
        ReactiveFormsModule
    ]
})
export class LeadModule { }
