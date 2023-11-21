import {Component, NgZone, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {take} from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-registrarProveedor',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class registrarProveedorComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, private _ngZone: NgZone) {}

    /**
   * Control Error Email
   */
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    matcher = new MyErrorStateMatcher();

  nuevoProveedor: any = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombreRazonSocial: '',
    telefono: '',
    direccion: '',
    departamento: '',
    municipio: '',
    email: '',
    barrio: '',
    regimenTributario: '',
    estadoActivo: false
  };
  
  mostrarFormulario1: boolean = false;
  mostrarBotonCrearProveedor = true;

  error: string | null = null;

  proveedores: any[] = [];

  proveedoresFiltrados: any[] = [];

  mensajeExitoso: string = '';
  mensajeFallido: string = '';


  errorMensaje: string | null = null;


  get email() {
    return this.nuevoProveedor.email;
  }

  guardarProveedor() {

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    this.http.post('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers', this.nuevoProveedor, httpOptions)
      .subscribe(
        (response) => {
          console.log('Proveedor guardado exitosamente', response);
          this.mensajeExitoso = "Proveedor guardado exitosamente"
        },
        (errorResponse) => {
          console.error('Error al guardar el proveedor', errorResponse.error);
          if (errorResponse.error && errorResponse.error.Message) {
            this.error = errorResponse.error.Message;
            this.mensajeFallido =  errorResponse.error.Message;
          } else {
            this.mensajeFallido = 'Error desconocido al guardar el proveedor.';
          }
        }
      );
  }

  

  refreshPage() {
    window.location.reload();
  }

  resetNuevoProveedor() {
    this.nuevoProveedor = {
      tipoDocumento: '',
      numeroDocumento: '',
      nombreRazonSocial: '',
      telefono: '',
      direccion: '',
      departamento: '',
      municipio: '',
      email: '',
      barrio: '',
      regimenTributario: '',
      estadoActivo: false
    };
  }


}



  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }
