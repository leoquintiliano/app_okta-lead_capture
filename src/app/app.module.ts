import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import {CurrencyPipe} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RequestInterceptor} from "./interceptors/request-interceptor";
import {FormsModule} from "@angular/forms";
import {LeadModule} from "./lead/lead.module";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {LocalizacaoComponent} from "./localizacao/localizacao.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LeadsComponent } from './leads/leads.component';
import {MatCardModule} from "@angular/material/card";
import {MatSortModule} from "@angular/material/sort";
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    LocalizacaoComponent,
    LoginComponent,
    SignupComponent,
    LeadsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        LeadModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatSortModule,
        MatToolbarModule
    ],
  // providers: [{provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor,multi: true}, {provide: CurrencyPipe, multi: true},{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlImpl}],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor,multi: true}, {provide: CurrencyPipe, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
