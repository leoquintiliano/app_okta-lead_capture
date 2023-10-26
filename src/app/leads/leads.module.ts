import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {LeadRoutingModule} from "../lead/lead-routing/lead-routing.module";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    LeadRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatToolbarModule,
    MatSortModule
  ]
})
export class LeadsModule { }
