import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-registrarProveedor',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class registrarProveedorComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, private route: ActivatedRoute) 
  { this._id = this.route.snapshot.paramMap.get('id'); }

   /**
 * Control Error Textfields
 */
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    tipoDocumentoFormControl = new FormControl('', [Validators.required]);
    numeroDocumentoFormControl = new FormControl('', [Validators.required]);
    nombreRazonSocialFormControl = new FormControl('', [Validators.required]);
    telefonoFormControl = new FormControl('', [Validators.required]);
    direccionFormControl = new FormControl('', [Validators.required]);
    departamentoFormControl = new FormControl('', [Validators.required]);
    municipioFormControl = new FormControl('', [Validators.required]);
    barrioFormControl = new FormControl('', [Validators.required]);
    regimenTributarioFormControl = new FormControl('', [Validators.required]);
    matcher = new MyErrorStateMatcher();

  _id: string | null;
  tittleForm: string = "REGISTRAR PROVEEDOR"  
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
  };
  
  opened: boolean = false;
  proveedores: any[] = [];
  proveedoresEncontrados: any[] = [];
  mensajeExitoso: string = '';
  mensajeFallido: string = '';


  ngOnInit(): void {
    this.cargarEditarProveedor();
  }

  async guardarProveedor() {
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers`
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    try {
      const response = await this.http.post(url,this.nuevoProveedor, httpOptions).toPromise();
      this.mensajeExitoso = "Proveedor guardado exitosamente"
      setTimeout(() => {
        this.refreshPage();
      }, 3000);
    } catch (error) {
      this.mensajeFallido = 'Error al guardar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  async cargarEditarProveedor() {
    if (this._id !== null) {
      this.tittleForm = "EDITAR PROVEEDOR";
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`,
        })
      };
      try {
        this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers/${this._id}`, httpOptions)
          .subscribe(response => {
            if (response.Status) {
              this.nuevoProveedor.tipoDocumento = response.Data.tipoDocumento,
              this.nuevoProveedor.numeroDocumento = response.Data.numeroDocumento,
              this.nuevoProveedor.nombreRazonSocial = response.Data.nombreRazonSocial,
              this.nuevoProveedor.telefono = response.Data.telefono,
              this.nuevoProveedor.direccion = response.Data.direccion,
              this.nuevoProveedor.departamento = response.Data.departamento,
              this.nuevoProveedor.municipio = response.Data.municipio,
              this.nuevoProveedor.email = response.Data.email,
              this.nuevoProveedor.barrio = response.Data.barrio,
              this.nuevoProveedor.regimenTributario = response.Data.regimenTributario
            }
          });
      } catch (error) {
        this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }
    }
  }

  async editarProveedor() {
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers/${this._id}`
    const body = {
      tipoDocumento: this.nuevoProveedor.tipoDocumento,
      numeroDocumento: this.nuevoProveedor.numeroDocumento,
      nombreRazonSocial: this.nuevoProveedor.nombreRazonSocial,
      telefono: this.nuevoProveedor.telefono,
      direccion: this.nuevoProveedor.direccion,
      departamento: this.nuevoProveedor.departamento,
      municipio: this.nuevoProveedor.municipio,
      email: this.nuevoProveedor.email,
      barrio: this.nuevoProveedor.barrio,
      regimenTributario: this.nuevoProveedor.regimenTributario
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
      this.mensajeExitoso = "Proveedor actualizado exitosamente"
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
}

  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }
