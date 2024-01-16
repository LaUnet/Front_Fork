import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { DialogoArticuloComponent } from "../dialogo.articulo/dialogo.articulo.component";
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { Target } from '@angular/compiler';
import { LocalStorageService } from '../local-storage.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})

export class ComprasComponent {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public dialogo: MatDialog,
    private localStorageService: LocalStorageService) { }


  columnas: string[] = ['descripcion', 'referencia', 'marca', 'precio', 'impuesto', 'subtotal', 'cantidad', 'precioventa', 'total', 'accion'];

  openedMenu!: boolean;
  openedArticle!: boolean;
  openedProvider!: boolean;
  dataSourceCompras: any = [];
  dataSourceProveedores: any = [];
  dataSourceubicaciones: any = [];
  dataSourceArticulos: any = [];
  dataSourceCargarArticulos: any = [];
  isLoadingResults: boolean = false;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  localStorageToken !: any; 
  pageSizeOptions = [20];
  searchDescription!: boolean;
  searchCode!: boolean;
  _id!: any;
  cantidadArticulos !: number;
  indice !: number;
  subscriber!: Subscription;
  isEdit: boolean = true;

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
    marca: '',
    referencia: '',
    subotalUnitario: '',
    descuento: '',
    ivaUnitario: '',
    totalUnitario: '',
    cantidad: '',
    subtotal: '',
    iva: '',
    total: '',
    valorDeVenta: '',
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
    numeroFactura: '',
    fechaFactura: '',
    subtotal: '',
    descuento: '',
    iva: '',
    total: '',
    observaciones: '',
  };

  matcher = new MyErrorStateMatcher();
  mensajeExitosoArticulo: string = '';
  mensajeFallidoArticulo: string = '';
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {});
  }

  ngOnDestroy() {
    this.subscriber?.unsubscribe();
    this.localStorageToken = this.localStorageService.getItem('access_token');
    this.localStorageService.clear();
    this.localStorageService.setItem('access_token', this.localStorageToken);
  }

  async cargarUbicaciones() {
    this.mensajeFallidoArticulo = "";
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
            this.dataSourceubicaciones = response.Data;
          }
        }, error => {
          if (error.status === 401) {
            this.routerLinkLogin();
          }
          console.error('Error en la solicitud:', error);
        });
    } catch (error) {
      this.mensajeFallidoArticulo = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }


  async buscarProveedor() {
    this.mensajeFallido = "";
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
            this.dataSourceProveedores = response.Data.docs.length > 0 ? response.Data.docs : null;
            this.nuevoProveedor.nombreRazonSocial = this.dataSourceProveedores !== null ? this.dataSourceProveedores[0].nombreRazonSocial : "NO EXISTE"
            this.nuevoProveedor.tipoDocumento = this.dataSourceProveedores !== null ? this.dataSourceProveedores[0].tipoDocumento : "NO EXISTE"
            this.nuevoProveedor.numeroDocumento = this.dataSourceProveedores !== null ? this.dataSourceProveedores[0].numeroDocumento : null
          }
          this.isLoadingResults = false;
        }, error => {
          this.isLoadingResults = false;
          if (error.status === 401) {
            this.routerLinkLogin();
          }
          console.error('Error en la solicitud:', error);
        });
    } catch (error) {
      this.mensajeFallido = 'Error al consultar Proveedor. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  async buscarcompras() {
    this.mensajeFallido = "";
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
          }
          this.isLoadingResults = false;
        }, error => {
          this.isLoadingResults = false;
          if (error.status === 401) {
            this.routerLinkLogin();
          }
          console.error('Error en la solicitud:', error);
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
      this.mensajeExitosoArticulo = "Artículo guardado correctamente.";
      setTimeout(() => {
        this.openedArticle = false;
        this.setArticulo();
      }, 3000);
    } catch (error) {
      this.mensajeFallidoArticulo = 'Error al guardar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  setArticulo() {
    this.nuevoArticulo.codigoBarras = '';
    this.codigoBarrasFormControl.reset();
    this.nuevoArticulo.descripcion = '';
    this.descripcionFormControl.reset();
    this.nuevoArticulo.marca = '';
    this.marcaFormControl.reset();
    this.nuevoArticulo.referencia = '';
    this.referenciaFormControl.reset();
    this.nuevoArticulo.unidadMedida = '';
    this.unidadMedidaFormControl.reset();
    this.nuevoArticulo.codigoUbicacion = '';
    this.codigoUbicacionFormControl.reset();
    this.mensajeExitosoArticulo = '';
    this.mensajeFallidoArticulo = '';
  };

  mostrarDialogo(message: string, process: number): void {
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

  mostrarArticuloDialogo(/*message: string*/): void {
    this.dialogo
      .open(DialogoArticuloComponent, {
        //data: message
      })
      .afterClosed()
      .subscribe((element: any = []) => {
        if (element) {
          this.cargarArticuloStorage(element)
        } else {
          //alert("No hacer nada");
        }
      });
  }

  routerLinkProveedor(): void {
    this.router.navigate(['/registrarProveedor'])
  };
  routerLinkLogin(): void {
    this.router.navigate(['/login'])
    this.localStorageService.clear();
  };
  /**
    filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceCompras.filter = filtro.trim().toLowerCase();
      this.isLoadingResults = false;
    }
   */
  filtrarProveedor(event: Event) {
    const filtro = (event as Target as HTMLInputElement).value;
    return this.dataSourceProveedores.filter = filtro.trim().toLowerCase().includes;
  }

  refreshPage() {
    window.location.reload();
  }

  async cargarArticuloStorage(element: any = []) {
    this.localStorageService.setItem(element._id, JSON.stringify(element));
    this.dataSourceCargarArticulos = [...this.dataSourceCargarArticulos, JSON.parse(this.localStorageService.getItem(element._id)!)];
    this.cantidadArticulos = this.dataSourceCargarArticulos.length
  }

  async borrarArticuloStorage(id: string, i: number){
    this.localStorageService.removeItem(id);
    this.dataSourceCargarArticulos.splice(i, 1);
    this.dataSourceCargarArticulos = [...this.dataSourceCargarArticulos];
    this.cantidadArticulos = this.dataSourceCargarArticulos.length
  }
}
export class compras {
  constructor(public descripcion: String, public marca: string, public referencia: string,
    public precio: string, public descuento: string, public impuesto: string, public subtotal: string, public cantidad: string,
    public precioventa: string, public total: string, public accion: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
