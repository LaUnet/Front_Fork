import {Component, NgZone, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {take} from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-buscarCliente',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class buscarClienteComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, private _ngZone: NgZone) {}

    /**
   * Control Error Email
   */
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    matcher = new MyErrorStateMatcher();

    isChecked = true;


  nuevoProveedor: any = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombreRazonSocial: '',
    telefono: '',
    direccion: '',
    departamento: '',
    municipio: '',
    email: '',
    regimenTributario: '',
    estadoActivo: false
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





  mostrarFormulario() {
    this.mostrarFormulario1 = true;
    this.mostrarBotonCrearProveedor = false; 
  }

  volverAFormulario() {
    this.mostrarBotonCrearProveedor = true;
    this.mostrarFormulario1 = false;
  }
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
        },
        (errorResponse) => {
          console.error('Error al guardar el proveedor', errorResponse);
          if (errorResponse.error && errorResponse.error.Message) {
            this.error = errorResponse.error.Message;
          } else {
            this.error = 'Error desconocido al guardar el proveedor.';
          }
        }
      );
  }

  buscarProveedores() {
    const token = this.tokenService.token;
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
  
    this.http.get('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers', httpOptions)
      .subscribe(
        (response: any) => {
          console.log('Proveedores obtenidos exitosamente', response);
          this.proveedores = response.Data;
          this.mostrarListaProveedores = true;
          this.mostrarBotonCrearProveedor = false;
          this.mostrarBotonBuscarProveedor = false;
        },
        (errorResponse) => {
          console.error('Error al obtener los proveedores', errorResponse);
        }
      );
  }
  
  eliminarProveedor(proveedor: any) {
    const token = this.tokenService.token;
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
  
    this.http.delete(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers/${proveedor._id}`, httpOptions).subscribe(
      (response) => {
        console.log('Artículo borrado exitosamente');
        this.mensajeExitoso = 'Operación exitosa: El artículo se ha eliminado correctamente.';
        setTimeout(() => {
          this.refreshPage();
        }, 3000);


        setTimeout(() => {
          this.mensajeExitoso = '';
        }, 5000);
      },
      (error) => {
        console.error('Error al borrar el artículo', error);
        this.mensajeFallido = 'Error: El artículo no se ha podido eliminar ';
      }
    );
  }

  filtrarProveedores() {
    this.proveedoresFiltrados = this.proveedores.filter((proveedor: any) => {
      return proveedor.nombreRazonSocial.toLowerCase().includes(this.filtro.toLowerCase());
    });
  }

  ngOnInit() {  
    this.filtrarProveedores();
  }
  
  ngDoCheck() {
    this.filtrarProveedores();
  }

  refreshPage() {
    window.location.reload();
  }

  editarProveedor(proveedor: any) {
    // Copia los valores del proveedor seleccionado a proveedorEditado
    this.proveedorEditado = { ...proveedor };
    this.modoEdicion = true; // Mostrar el formulario de edición
  }

  guardarEdicion() {
    // Realiza una solicitud HTTP PUT para guardar los cambios en el servidor
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    this.http.patch(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers/${this.proveedorEditado._id}`, this.proveedorEditado, httpOptions).subscribe(
      (response) => {
        console.log('Proveedor editado exitosamente', response);
        // Actualiza el proveedor original con los valores editados
        Object.assign(this.proveedores.find(p => p._id === this.proveedorEditado._id), this.proveedorEditado);
        this.modoEdicion = false; // Vuelve al modo de visualización
      },
      (errorResponse) => {
        console.error('Error al editar el proveedor', errorResponse);
        if (errorResponse.error && errorResponse.error.Message) {
          this.errorMensaje = errorResponse.error.Message;
        } else {
          this.errorMensaje = 'Error desconocido al editar el proveedor.';
        }
      }
    );
  }

  cancelarEdicion() {
    this.modoEdicion = false; // Cancela la edición y vuelve al modo de visualización
  }  
}

  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }
