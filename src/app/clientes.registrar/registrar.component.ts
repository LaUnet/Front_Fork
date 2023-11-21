import {Component, NgZone, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {take} from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-registrarCliente',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class registrarClienteComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, private _ngZone: NgZone) {}

    /**
   * Control Error Email
   */
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    matcher = new MyErrorStateMatcher();

    isChecked = true;


  nuevoCliente: any = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombreRazonSocial: '',
    telefono: '',
    extension: "",
    direccion: '',
    departamento: '',
    municipio: '',
    email: '',
    regimenTributario: '',
    estadoActivo: false,
    barrio:"",
    isChecked: true
  };
  
  mostrarFormulario1: boolean = false;
  mostrarBotonCrearProveedor = true;

  error: string | null = null;

  proveedores: any[] = [];
  mostrarListaProveedores = false;
  mostrarBotonBuscarProveedor = false;

  filtro: string = '';
  proveedoresFiltrados: any[] = [];

  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  modoEdicion: boolean = false;
  proveedorEditado: any = {};

  errorMensaje: string | null = null;




  guardarCliente() {

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    this.http.post('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers', this.nuevoCliente, httpOptions)
      .subscribe(
        (response) => {
          console.log('Proveedor guardado exitosamente', response);
          this.mensajeExitoso = 'Operación exitosa: El cliente se ha creado correctamente.';
        },
        (errorResponse) => {
          console.error('Error al guardar el proveedor', errorResponse);
          if (errorResponse.error && errorResponse.error.Message) {
            this.error = errorResponse.error.Message;
            this.mensajeFallido =  errorResponse.error.Message;
          } else {
            this.error = 'Error desconocido al guardar el proveedor.';
            this.mensajeFallido = 'Error desconocido al guardar el proveedor.';
          }
        }
      );
  }

  refreshPage() {
    window.location.reload();
  }


  resetNuevoCliente() {
    this.nuevoCliente = {
      tipoDocumento: '',
      numeroDocumento: '',
      nombreRazonSocial: '',
      telefono: '',
      extension: "",
      direccion: '',
      departamento: '',
      municipio: '',
      email: '',
      regimenTributario: '',
      estadoActivo: false,
      barrio:"",
      isChecked: true
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
