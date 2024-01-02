import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarArticulo',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class registrarArticuloComponent {
  constructor(private router: Router,private http: HttpClient, private tokenService: TokenService, private route: ActivatedRoute) 
  { this._id = this.route.snapshot.paramMap.get('id'); }

/**
 * Control Error Textfields
 */
codigoBarrasFormControl = new FormControl('', [Validators.required]);
descripcionFormControl = new FormControl('', [Validators.required]);
marcaFormControl = new FormControl('', [Validators.required]);
referenciaFormControl = new FormControl('', [Validators.required]);
unidadMedidaFormControl = new FormControl('', [Validators.required]);
codigoUbicacionFormControl = new FormControl('', [Validators.required]);
matcher = new MyErrorStateMatcher();

_id: string | null;
tittleForm: string = "REGISTRAR ARTICULO" 

  ubicaciones: any[] = [];

  articulosEncontrados: any[] = [];
  opened: boolean = false;
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  nuevoArticulo = {
    codigoBarras: '',
    descripcion: '',
    unidadMedida: '',
    codigoUbicacion: '',
    marca:'',
    referencia: ''
  };


  async crearArticulo() {
    const url = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles';
    const body = {
      codigoBarras: this.nuevoArticulo.codigoBarras,
      descripcion: this.nuevoArticulo.descripcion,
      unidadMedida: this.nuevoArticulo.unidadMedida,
      codigoUbicacion: this.nuevoArticulo.codigoUbicacion,
      referencia: this.nuevoArticulo.referencia,
      marca: this.nuevoArticulo.marca
    };
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    try {
      const response = await this.http.post(url, body, httpOptions).toPromise();
      this.mensajeExitoso = "Artículo guardado correctamente.";
      setTimeout(() => {
        this.refreshPage();
      }, 3000);
    } catch (error) {
      this.mensajeFallido = 'Error al guardar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.cargarEditarArticulo();
  }

  cargarUbicaciones() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    try {
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.ubicaciones = response.Data;
        }
      }, error => {
        if (error.status === 401) {
          this.routerLinkLogin();
        }
        this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }); 
    } catch (error) {
      this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  async cargarEditarArticulo() {
    if (this._id !== null) {
      this.tittleForm = "EDITAR ARTICULO";
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`,
        })
      };
      try {
        this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${this._id}`, httpOptions)
          .subscribe(response => {
            if (response.Status) {
              this.nuevoArticulo.codigoBarras = response.Data.codigoBarras,
              this.nuevoArticulo.descripcion = response.Data.descripcion,
              this.nuevoArticulo.marca = response.Data.marca,
              this.nuevoArticulo.referencia = response.Data.referencia,
              this.nuevoArticulo.unidadMedida = response.Data.unidadMedida,
              this.nuevoArticulo.codigoUbicacion = response.Data.codigoUbicacion
            }
          }, error => {
            if (error.status === 401) {
              this.routerLinkLogin();
            }
            this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
            console.error('Error en la solicitud:', error);
          }); 
      } catch (error) {
        this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }
    }
  }

  async editarArticulo() {
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${this._id}`
    const body = {
      codigoBarras: this.nuevoArticulo.codigoBarras,
      descripcion: this.nuevoArticulo.descripcion,
      marca: this.nuevoArticulo.marca,
      referencia:this.nuevoArticulo.referencia,
      unidadMedida:this.nuevoArticulo.unidadMedida,
      codigoUbicacion:this.nuevoArticulo.codigoUbicacion
    };
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    try {
      const response = await this.http.patch(url,body, httpOptions).toPromise();
      this.mensajeExitoso = "Artículo actualizado exitosamente"
      setTimeout(() => {
        this.refreshPage();
      }, 3000);
    } catch (error) {
      this.mensajeFallido = 'Error al editar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }
  
  refreshPage() {
    window.location.reload();
  }
  routerLinkLogin(): void {
    this.router.navigate(['/login'])
  };
}

  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }