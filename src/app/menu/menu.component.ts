import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  opened: boolean = false;
  editingItem: any = null;
  isEditing: boolean = false;

  errorMessage: string = '';
  successMesssage: String = '';

  mostrarFormularioRegistrarUsuario: boolean = false;
  mostrarFormularioBuscarUsuario: boolean = false;

  constructor(private http: HttpClient, private tokenService: TokenService) {
   }

   registrarUsuario() {
    this.mostrarFormularioRegistrarUsuario = !this.mostrarFormularioRegistrarUsuario;
  }

  buscarUsuario() {
    this.mostrarFormularioBuscarUsuario = !this.mostrarFormularioBuscarUsuario;
  }



  printHello() {
    console.log('Hola Mundo');
  }
}
