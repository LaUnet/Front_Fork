import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

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
    this.cargarProveedores();
  }

  async cargarProveedores() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers', httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceProveedores = response.Data.docs;
            this.dataSourceProveedores.sort = this.sort;
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

  async cargarSelectProveedor(_id: string) {
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
              this.nuevoProveedor.numeroDocumento = response.Data.numeroDocumento
            }
            else{
              this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
              console.error('Error en la solicitud:', response);
            }
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

  mostrarDialogo(): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `Seguro requieres Registrar Proveedor?`
      })
      .afterClosed()
      .subscribe((confirmar: Boolean) => {
        if (confirmar) {
          this.routerLinkProveedor();
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
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceProveedores.filter = filtro.trim().toLowerCase();
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
