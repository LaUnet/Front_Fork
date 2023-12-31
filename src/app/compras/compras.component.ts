import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { Target } from '@angular/compiler';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public dialogo: MatDialog) { }


  columnas: string[] = ['descripcion', 'referencia', 'marca', 'precio', 'descuento','impuesto', 'subtotal','cantidad', 'precioventa', 'total','accion'];
  openedMenu!: boolean;
  openedArticle!: boolean;
  openedProvider!: boolean;
  dataSourceCompras: any;
  dataSourceProveedores: any;
  dataSourceubicaciones: any;
  dataSourceArticulos: any;
  isLoadingResults: boolean = false;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [20];
  searchDescription!: boolean;
  searchCode!: boolean;
  _id!: string;


  /**
   * Control Error Textfields Articles
   */
  codigoBarrasFormControl = new FormControl('', [Validators.required]);
  descripcionFormControl = new FormControl('', [Validators.required]);
  marcaFormControl = new FormControl('', [Validators.required]);
  referenciaFormControl = new FormControl('', [Validators.required]);
  unidadMedidaFormControl = new FormControl('', [Validators.required]);
  codigoUbicacionFormControl = new FormControl('', [Validators.required]);
  subotalUnitarioFormControl = new FormControl('', [Validators.required]);
  impuestoUnitarioFormControl = new FormControl('', [Validators.required]);
  totalUnitarioFormControl = new FormControl('', [Validators.required]);
  cantidadFormControl = new FormControl('', [Validators.required]);
  subtotalArticuloFormControl = new FormControl('', [Validators.required]);
  totalArticuloFormControl = new FormControl('', [Validators.required]);
  precioVentaArticuloFormControl = new FormControl('', [Validators.required]);
  nuevoArticulo = {
    codigoBarras: '',
    descripcion: '',
    unidadMedida: '',
    codigoUbicacion: '',
    marca:'',
    referencia: '',
    subotalUnitario:'',
    descuento:'',
    ivaUnitario:'',
    totalUnitario:'',
    cantidad:'',
    subtotal:'',
    iva:'',
    total:'',
    valorDeVenta:'',
  };

/**
 * Control Error Textfields Providers
 */
     tipoDocumentoFormControl = new FormControl('', [Validators.required]);
     numeroDocumentoFormControl = new FormControl('', [Validators.required]);
     nombreRazonSocialFormControl = new FormControl('', [Validators.required]);

   nuevoProveedor: any = {
     tipoDocumento: '',
     numeroDocumento: '',
     nombreRazonSocial: ''
   };

   /**
 * Control Error Textfields Compras
 */
   numeroFacturaFormControl = new FormControl('', [Validators.required]);
   fechaFacturaFormControl = new FormControl('', [Validators.required]);
   fechaVencimientoFormControl = new FormControl('', [Validators.required]);
   subtotalFormControl = new FormControl('', [Validators.required]);
   impuestoFormControl = new FormControl('', [Validators.required]);
   totalFormControl = new FormControl('', [Validators.required]);

 nuevaCompra: any = {
  numeroFactura:'',
  fechaFactura:'',
  subtotal:'',
  descuento:'',
  iva:'',
  total:'',
  observaciones:'',
 };

  matcher = new MyErrorStateMatcher();
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  @ViewChild(MatSort, {static: true}) sort!: MatSort;  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
  }

  cargarUbicaciones() {
    console.log("Paso por acá")
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    try {
      console.log("Tambien por acá")
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceubicaciones = response.Data;
        }else{
          this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
          console.error('Error en la solicitud:', response);
        }
      });
     
    } catch (error) {
      this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }


  async buscarProveedor() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };

    let httpParams = new HttpParams();
    httpParams = httpParams.append('numeroDocumento', this.nuevoProveedor.numeroDocumento);
    this.isLoadingResults = true;
    try {
      this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers?${httpParams}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceProveedores = response.Data.docs;
            this.dataSourceProveedores = response.Data.docs.length > 0 ? response.Data.docs : null;
            this.nuevoProveedor.nombreRazonSocial = this.dataSourceProveedores !== null ? this.dataSourceProveedores[0].nombreRazonSocial : "NO EXISTE"
            this.nuevoProveedor.tipoDocumento = this.dataSourceProveedores !== null ? this.dataSourceProveedores[0].tipoDocumento : "NO EXISTE"
          }else{
            this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
            console.error('Error en la solicitud:', response); 
          }
        this.isLoadingResults = false;
        });
    } catch (error) {
      this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error); 
    }
  }

  async buscarcompras() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
  try {
    this.isLoadingResults = true;
    this.http.get<any>('https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceCompras = new MatTableDataSource(response.Data.docs);
          this.pageSize = response.Data.docs.limit;
          this.pageIndex = response.Data.docs.page;
          this.length = response.Data.totalDocs;
        }else{
          this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
          console.error('Error en la solicitud:', response); 
        }
        this.isLoadingResults = false;
      });
  } catch (error) {
    this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
    console.error('Error en la solicitud:', error); 
  }
}

/**
async recargarcompras(page: PageEvent) {
    this.dataSourceCompras = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceCompras = new MatTableDataSource(response.Data.docs);
            this.pageIndex = response.Data.docs.page;
          }else{
            this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
            console.error('Error en la solicitud:', response); 
          }
          this.isLoadingResults = false;
        });
    } catch (error) {
      this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error); 
    }
  }
*/

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
      this.openedArticle=false;
      this.setArticulo();
    }, 3000);
  } catch (error) {
    this.mensajeFallido = 'Error al guardar. Por favor, inténtelo nuevamente.';
    console.error('Error en la solicitud:', error);
  }
}

setArticulo(){
  this.nuevoArticulo.codigoBarras= '';
  this.codigoBarrasFormControl.reset();
  this.nuevoArticulo.descripcion= '';
  this.descripcionFormControl.reset();
  this.nuevoArticulo.marca= '';
  this.marcaFormControl.reset();
  this.nuevoArticulo.referencia= '';
  this.referenciaFormControl.reset();
  this.nuevoArticulo.unidadMedida= '';
  this.unidadMedidaFormControl.reset();
  this.nuevoArticulo.codigoUbicacion= '';
  this.codigoUbicacionFormControl.reset();
  this.mensajeExitoso = '';
  this.mensajeFallido = '';
  };

  mostrarDialogo(message:string, process:number): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: message
      })
      .afterClosed()
      .subscribe((confirmar: Boolean) => {
        if (confirmar) {
          if (process === 1) {
          this.routerLinkProveedor();
          }
          if (process === 2) {
            this.refreshPage();
            }
        } else {
          //alert("No hacer nada");
        }
      });
  }

  routerLinkProveedor():void{
    this.router.navigate(['/registrarProveedor'])
  };

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceCompras.filter = filtro.trim().toLowerCase();
    this.isLoadingResults = false;
  }

  filtrarProveedor(event: Event) {
    const filtro = (event as Target  as HTMLInputElement).value;
    return this.dataSourceProveedores.filter = filtro.trim().toLowerCase().includes;
} 


  refreshPage() {
    window.location.reload();
  }
}

export class compras {
  constructor(public descripcion: String, public marca: string, public referencia: string,
    public precio: string, public descuento: string, public impuesto: string, public subtotal: string, public cantidad: string,
    public precioventa: string,public total: string, public accion: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
