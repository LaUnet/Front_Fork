import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { registrarUsuarioComponent } from './usuarios.registrar/registrar.component';
import { buscarUsuarioComponent } from './usuarios.buscar/buscar.component';
import { registrarArticuloComponent } from './articulos.registrar/registrar.component';
import { buscarArticuloComponent } from './articulos.buscar/buscar.component';
import { registrarProveedorComponent } from './proveedores.registrar/registrar.component';
import { buscarProveedorComponent } from './proveedores.buscar/buscar.component';
import { registrarClienteComponent } from './clientes.registrar/registrar.component';
import { buscarClienteComponent } from './clientes.buscar/buscar.component';
import { registrarUbicacionComponent } from './ubicaciones.registrar/registrar.component';
import { buscarUbicacionComponent } from './ubicaciones.buscar/buscar.component';
import { VentasComponent } from './catalogoVentas/ventas.component';
import { ComprasComponent } from './catalogoCompras/compras.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'registrarUsuario', component: registrarUsuarioComponent },
  { path: 'editarUsuario/:id', component: registrarUsuarioComponent },
  { path: 'buscarUsuario', component: buscarUsuarioComponent },
  { path: 'registrarArticulo', component: registrarArticuloComponent },
  { path: 'editarArticulo/:id', component: registrarArticuloComponent },
  { path: 'buscarArticulo', component: buscarArticuloComponent },
  { path: 'registrarProveedor', component: registrarProveedorComponent },
  { path: 'editarProveedor/:id', component: registrarProveedorComponent },
  { path: 'buscarProveedor', component: buscarProveedorComponent },
  { path: 'registrarCliente', component: registrarClienteComponent },
  { path: 'editarCliente/:id', component: registrarClienteComponent },
  { path: 'buscarCliente', component: buscarClienteComponent },
  { path: 'registrarUbicacion', component: registrarUbicacionComponent },
  { path: 'editarUbicacion/:id', component: registrarUbicacionComponent },
  { path: 'buscarUbicacion', component: buscarUbicacionComponent },
  { path: 'ventasProductos', component: VentasComponent },
  { path: 'comprasProductos', component: ComprasComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
