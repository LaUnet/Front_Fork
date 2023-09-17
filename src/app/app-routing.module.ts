import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionComponent } from './administracion/administracion.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ProveedorComponent } from './proveedor/proveedor.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'articulo', component: ArticuloComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'proveedor', component: ProveedorComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
