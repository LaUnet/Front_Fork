import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ArticuloComponent} from './articulo/articulo.component';
import {LoginComponent} from './login/login.component'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import {Router} from '@angular/router';
import { AdministracionComponent } from './administracion/administracion.component';
import { MenuComponent } from './menu/menu.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProveedorComponent } from './proveedor/proveedor.component';

/**
 * Inicio Cambios realizados
 */
import {MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDividerModule} from '@angular/material/divider';
import {NgxPaginationModule} from 'ngx-pagination';
import { FlexLayoutModule } from '@angular/flex-layout';
/**
 * Fin Cambios realizados
 */



@NgModule({
  declarations: [
    AppComponent,
    ArticuloComponent,
    LoginComponent,
    AdministracionComponent,
    MenuComponent,
    ProveedorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
/**
 * Cambios realizados
 */
    MatSlideToggleModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDividerModule,
    NgxPaginationModule,
    FlexLayoutModule,
/**
 * Fin Cambios realizados
 */


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router:Router){
  }

 }
