import { NgModule } from '@angular/core';
import {Router} from '@angular/router';

import { AppComponent } from './app.component';
import {LoginComponent} from './login/login.component'
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './menu/menu.component';
import { registrarUsuarioComponent } from './usuarios.registrar/registrar.component';
import { buscarUsuarioComponent } from './usuarios.buscar/buscar.component';
import { registrarArticuloComponent} from './articulos.registrar/registrar.component';
import { buscarArticuloComponent} from './articulos.buscar/buscar.component';
import { registrarProveedorComponent} from './proveedores.registrar/registrar.component';
import { buscarProveedorComponent} from './proveedores.buscar/buscar.component';
import { registrarClienteComponent} from './clientes.registrar/registrar.component';
import { buscarClienteComponent} from './clientes.buscar/buscar.component';
import { registrarUbicacionComponent} from './ubicaciones.registrar/registrar.component';
import { buscarUbicacionComponent} from './ubicaciones.buscar/buscar.component';
import { VentasComponent } from './catalogoVentas/ventas.component';
import { ComprasComponent } from './catalogoCompras/compras.component';
import { DialogoConfirmacionComponent } from './dialogo.confirmacion/dialogo.component';
import { DialogoArticuloComponent } from './dialogo.articulo/dialogo.articulo.component';


import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';

/**
 * Angular Material
 */
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    registrarUsuarioComponent,
    buscarUsuarioComponent,
    registrarArticuloComponent,
    buscarArticuloComponent,
    registrarProveedorComponent,
    buscarProveedorComponent,
    registrarClienteComponent,
    buscarClienteComponent,
    registrarUbicacionComponent,
    buscarUbicacionComponent,
    ComprasComponent,
    DialogoConfirmacionComponent,
    VentasComponent,
    DialogoArticuloComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDialogModule,
    MatBadgeModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router:Router){
  }

 }
