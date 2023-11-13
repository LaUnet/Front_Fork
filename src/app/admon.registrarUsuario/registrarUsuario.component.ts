import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';

@Component({
  selector: 'app-registrarUsuario',
  templateUrl: './registrarUsuario.component.html',
  styleUrls: ['./registrarUsuario.component.css']
})
export class registrarUsuarioComponent {
  rol: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  _id: string = '';

  editingItem: any = null;
  isEditing: boolean = false;

  resultadoBusqueda: any = null;

  errorMessage: string = '';
  successMesssage: String = '';

  mostrarFormularioCrearUsuario: boolean = false;
  mostrarFormularioBuscarUsuario: boolean = false;

  constructor(private http: HttpClient, private tokenService: TokenService) {
   }

  toggleFormularioCrearUsuario() {
    this.mostrarFormularioCrearUsuario = !this.mostrarFormularioCrearUsuario;
    this.mostrarFormularioBuscarUsuario = false;
  }

  toggleFormularioBuscarUsuario() {
    this.mostrarFormularioBuscarUsuario = !this.mostrarFormularioBuscarUsuario;
    this.mostrarFormularioCrearUsuario = false;
  }


  async onSubmitCrearUsuario() {

    const url = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users';

    const body = {
      docs:[{
          roles: [this.rol],
          username: this.username,
          email: this.email,
          password: this.password
        }]
    };

    const token = this.tokenService.token;
    console.log("el body es ", body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    try {
      const response = await this.http.post(url, body, httpOptions).toPromise();
      this.successMesssage = 'Usuario creado correctamente';
      console.log('Respuesta del servidor:', response);
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.errorMessage = 'Error al crear el usuario. Por favor, inténtelo nuevamente.';
    }
  }

  async onSubmitBuscarUsuario() {
    
    console.log("entro a buscar");
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users`;

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    try {
      console.log("entro a buscar2");
      const response = await this.http.get(url, httpOptions).toPromise();
      const jsonResponse = response as any; 
      console.log("entro a buscar3 ", jsonResponse);
      this.resultadoBusqueda = jsonResponse?.Data; 
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.resultadoBusqueda = null; 
    }

  }


  editarRol(item: any) {
    this.editingItem = { ...item };
    this.isEditing = true;
  }

  cancelarEdicion() {
    this.isEditing = false;
  }

  async guardarCambios(id: string) {


    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users/${id}`;

    const body = {
      username: this.username,
      email: this.email
    };

    const token = this.tokenService.token;
    console.log("el body es ", token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    try {
      const response = await this.http.put(url, httpOptions).toPromise();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.resultadoBusqueda = null; 
    }

    this.isEditing = false;
    this.editingItem = null;
  }
  
  async borrarRol(id: string) {

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users/${id}`;

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };


    

    try {
      const response = await this.http.delete(url, httpOptions).toPromise();
      this.successMesssage = 'Usuario borrado correctamente';
      this.onSubmitBuscarUsuario();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.errorMessage = 'Error al eliminar el usuario. Por favor, inténtelo nuevamente.';
    }

  }
  
}
