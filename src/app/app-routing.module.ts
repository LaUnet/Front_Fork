import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { registrarUsuarioComponent } from './admon.registrarUsuario/registrarUsuario.component';
import { buscarUsuarioComponent } from './admon.buscarUsuario/buscarUsuario.component';
import { registrarArticuloComponent } from './articulos.registrar/registrar.component';
import { buscarArticuloComponent } from './articulos.buscar/buscar.component';
import { registrarProveedorComponent } from './proveedores.registrar/registrar.component';
import { buscarProveedorComponent } from './proveedores.buscar/buscar.component';
import { AdministracionComponent } from './administracion/administracion.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'registrarUsuario', component: registrarUsuarioComponent },
  { path: 'buscarUsuario', component: buscarUsuarioComponent },
  { path: 'registrarArticulo', component: registrarArticuloComponent },
  { path: 'buscarArticulo', component: buscarArticuloComponent },
  { path: 'registrarProveedor', component: registrarProveedorComponent },
  { path: 'buscarProveedor', component: buscarProveedorComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
