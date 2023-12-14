import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarUbicacion',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class registrarUbicacionComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, private route: ActivatedRoute) 
  { this._id = this.route.snapshot.paramMap.get('id'); }

  /**
 * Control Error Textfields
 */

  nombreZonaFormControl = new FormControl('', [Validators.required]);
  numeroZonaFormControl = new FormControl('', [Validators.required]);
  numeroEstanteriaFormControl = new FormControl('', [Validators.required]);
  numeroUbicacionFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  _id: string | null;
  tittleForm: string = "REGISTRAR UBICACION"
  ubicaciones: any[] = [];
  proveedores: any[] = [];
  opened: boolean = false;
  ubicacionesEncontrados: any[] = [];
  mensajeExitoso: string = '';
  mensajeFallido: string = '';
  nuevaUbicacion = {
    zona: '',
    numeroZona: '',
    estante: '',
    ubicacion: ''
  };

  ngOnInit(): void {
    this.cargarEditarUbicacion();
  }

  async crearUbicacion() {
    const url = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations';
    const body = {
      nombreZona: this.nuevaUbicacion.zona.substring(0, 10),
      numeroZona: this.nuevaUbicacion.numeroZona,
      numeroEstanteria: this.nuevaUbicacion.estante,
      numeroUbicacion: this.nuevaUbicacion.ubicacion
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
      this.mensajeExitoso = 'Ubicación guardada exitosamente';
      setTimeout(() => {
        this.refreshPage();
      }, 3000);
    } catch (error) {
      this.mensajeFallido = 'Error al crear. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  async cargarEditarUbicacion() {
    if (this._id !== null) {
      this.tittleForm = "EDITAR UBICACION";
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`,
        })
      };
      try {
        this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations/${this._id}`, httpOptions)
          .subscribe(response => {
            if (response.Status) {
              console.log(response.Data)
              this.nuevaUbicacion.zona = response.Data.nombreZona;
              console.log(response.Data.nombreZona)
              this.nuevaUbicacion.numeroZona = response.Data.numeroZona;
              this.nuevaUbicacion.estante = response.Data.numeroEstanteria;
              this.nuevaUbicacion.ubicacion = response.Data.numeroUbicacion;
            }else{
              this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
              console.error('Error en la solicitud:', response);
            }
          });
      } catch (error) {
        this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }
    }
  }

  async editarUbicacion() {
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations/${this._id}`
    const body = {
      nombreZona: this.nuevaUbicacion.zona.substring(0, 10),
      numeroZona: this.nuevaUbicacion.numeroZona,
      numeroEstanteria: this.nuevaUbicacion.estante,
      numeroUbicacion: this.nuevaUbicacion.ubicacion
    };
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    try {
      const response = await this.http.patch(url, body, httpOptions).toPromise();
      this.mensajeExitoso = "Ubicación actualizada exitosamente"
      setTimeout(() => {
        this.refreshPage();
      }, 3000);
    } catch (error) {
      this.mensajeFallido = 'Error al editar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  refreshPage() {
    window.location.reload()
  }
  
}

  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }