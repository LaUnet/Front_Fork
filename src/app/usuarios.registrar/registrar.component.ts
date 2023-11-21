import {Component, NgZone, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {take} from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarUsuario',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class registrarUsuarioComponent {


  constructor(private http: HttpClient, private tokenService: TokenService, private _ngZone: NgZone) {}

    /**
   * Control Error Email
   */
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    matcher = new MyErrorStateMatcher();

    hide = true;

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


  mensajeExitoso: string = '';
  mensajeFallido: string = '';


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
      this.mensajeExitoso = "Usuario guardado exitosamente"
    } catch (error) {
      this.mensajeFallido =  'Error al crear el usuario. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
      this.errorMessage = 'Error al crear el usuario. Por favor, inténtelo nuevamente.';
    }
  }

 
}


  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }