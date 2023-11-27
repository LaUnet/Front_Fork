import {Component, NgZone, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {take} from 'rxjs/operators';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarUbicacion',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class registrarUbicacionComponent {
  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService) { }

    /**
   * Control Error Email
   */
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    matcher = new MyErrorStateMatcher();

  ubicaciones: any[] = [];
  proveedores: any[] = [];
  opened: boolean = false;
  codigoArticuloBusqueda: string = '';
  articulosEncontrados: any[] = [];
  mostrarResultados: boolean = false;

  errorMessage: string = '';
  successMesssage: String = '';

  articuloEditando: any = null;

  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  filtroDescripcion: string = '';

  mostrarCampoFiltrar: boolean = false;


  mostrarFormulario = false;
  mostrarFormularioBuscar = false;
  nuevaUbicacion = {
    zona: '',
    numeroZona: '',
    estante: '',
    ubicacion: ''
  };

  mostrarFormularioCrearArticulo(event: Event) {
    event.preventDefault();
    this.mostrarFormulario = true;
    this.mostrarFormularioBuscar = false;
    this.mostrarResultados = false;
  }

  mostrarFormularioBuscarArticulo(event: Event) {
    event.preventDefault();
    this.mostrarFormulario = false;
    this.mostrarFormularioBuscar = true;
    
  }


  async crearUbicacion() {
    const url = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations';

    const body = {
      codigo: "0000010103",
      nombreZona: this.nuevaUbicacion.zona.substring(0, 10),
      numeroZona: this.nuevaUbicacion.numeroZona,
      numeroEstanteria: this.nuevaUbicacion.estante,
      numeroUbicacion: this.nuevaUbicacion.ubicacion,
      estadoActivo: true
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
      this.successMesssage = 'Ubicacion creada correctamente';
      console.log('Respuesta del servidor:', response);
      this.mensajeExitoso = 'Operación exitosa: La Ubicación se ha creado correctamente.';
      
    } catch (error) {
      this.errorMessage =  'Error al crear la ubicación. Por favor, inténtelo nuevamente.';
      this.mensajeFallido = 'Error al crear la ubicación. Por favor diligenciar todo el formulario.';
    }
  }

  

  

  resetnuevaUbicacion() {
    this.nuevaUbicacion = {
      zona: '',
      numeroZona: '',
      estante: '',
      ubicacion: ''
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