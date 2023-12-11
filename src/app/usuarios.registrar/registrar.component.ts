import { Component, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarUsuario',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class registrarUsuarioComponent {


  constructor(private http: HttpClient, private tokenService: TokenService, private _ngZone: NgZone, private route: ActivatedRoute) {
    this._id = this.route.snapshot.paramMap.get('id');
  }

  /**
 * Control Error Email & Password
 */
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]);
  matcher = new MyErrorStateMatcher();
  hide = true;

  rol: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  _id: string | null;
  opened: boolean = false;
  usuariosEncontrados!: any[];
  tittleForm: string = "REGISTRAR USUARIO"
  mensajeExitoso: string = '';
  mensajeFallido: string = '';



  ngOnInit(): void {
    this.cargarEditarUsuario();
  }

  async onSubmitCrearUsuario() {
    const url = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users';
    const body = {
      roles: [this.rol],
      username: this.username,
      email: this.email,
      password: this.password
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
      console.log('Respuesta del servidor:', response);
      this.mensajeExitoso = "Usuario guardado exitosamente"
    } catch (error) {
      this.mensajeFallido = 'Error al crear el usuario. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
    setTimeout(() => {
      this.refreshPage();
    }, 3000);
  }

  async cargarEditarUsuario() {
    if (this._id !== null) {
      this.tittleForm = "EDITAR USUARIO";
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`,
        })
      };
      try {
        this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users/${this._id}`, httpOptions)
          .subscribe(response => {
            if (response.Status) {
              this.usuariosEncontrados = response.Data[0];
              this.username = this.usuariosEncontrados[0].username;
              this.email = this.usuariosEncontrados[0].email;
              this.password = this.usuariosEncontrados[0].password;
              this.rol = this.usuariosEncontrados[0].rolName[0].name;
            }
          });
      } catch (error) {
        this.mensajeFallido = 'Error al consultar el usuario. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }
      setTimeout(() => {
        this.refreshPage();
      }, 3000);
    }
  }

  async onSubmitEditarUsuario() {
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users/${this._id}`
    const body = {
      roles: [this.rol],
      username: this.username,
      email: this.email,
      password: this.password
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
      const response = await this.http.patch(url, body, httpOptions).toPromise();
      console.log('Respuesta del servidor:', response);
      this.mensajeExitoso = "Usuario actualizado exitosamente"
    } catch (error) {
      this.mensajeFallido = 'Error al editar el usuario. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
    setTimeout(() => {
      this.refreshPage();
    }, 3000);
  }


  refreshPage() {
    window.location.reload();
  }

}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}