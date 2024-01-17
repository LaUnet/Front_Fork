import { ChangeDetectorRef, Component, ViewChild, AfterContentChecked } from '@angular/core';
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
    private localStorageService: LocalStorageService, private changeDetector: ChangeDetectorRef) { }


  columnas: string[] = ['No', 'descripcion', 'referencia', 'marca', 'precio', 'impuesto', 'subtotal', 'cantidad', 'precioVenta', 'total', 'isEdit'];

  openedMenu!: boolean;
  openedArticle!: boolean;
  openedProvider!: boolean;
  dataSourceCompras: any = [];
  dataSourceProveedores: any = [];
  dataSourceubicaciones: any = [];
  dataSourceArticulos: any = [];
  dataSourceCargarArticulos: any = [];
  dataSourcePrecio: any;
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
  indice !: number;
  subscriber!: Subscription;
  cantidadArticulos !: number;
  totalUnitario!: number;
  totalIvaCompra!: number;
  subtotalCompra!: number;
  totalCompraUnitario!: number;
  totalCompra!: number;

  /**
   * Control Error Textfields Articles
   */
  codigoBarrasFormControl = new FormControl('', [Validators.required]);
  descripcionFormControl = new FormControl('', [Validators.required]);
  marcaFormControl = new FormControl('', [Validators.required]);
  referenciaFormControl = new FormControl('', [Validators.required]);
  unidadMedidaFormControl = new FormControl('', [Validators.required]);
  codigoUbicacionFormControl = new FormControl('', [Validators.required]);
  subtotalUnitarioFormControl = new FormControl('', [Validators.required]);
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
    subtotalUnitario: '',
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

  nuevoPrecio: any = {
    precioVenta: "0",
    ivaCompra: "0",
    subtotalCompra: "0",
    totalCompra: "0",
  }

  matcher = new MyErrorStateMatcher();
  mensajeExitosoArticulo: string = '';
  mensajeFallidoArticulo: string = '';
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  ngOnInit() {
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => { });
  }

  /**
  ngAfterContentChecked(): void {
    console.log("Pasó por acá?")
    this.changeDetector.detectChanges();
  }
   */

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

  mostrarDialogo(message: string, process: number, element: any, i: number): void {
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
          if (process === 3) {
            this.borrarArticuloStorage(element, i);
          }
        } else { }
      });
  }

  mostrarArticuloDialogo(): void {
    this.dialogo
      .open(DialogoArticuloComponent, {
        //data: message
      })
      .afterClosed()
      .subscribe((element: any = []) => {
        try {
          if (element.length !== 0) {
            this.cargarArticuloStorage(element)
          } else {
            //alert("No hacer nada");
          }
        } catch (error) {
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

  filtrarProveedor(event: Event) {
    const filtro = (event as Target as HTMLInputElement).value;
    return this.dataSourceProveedores.filter = filtro.trim().toLowerCase().includes;
  }

  cargarArticuloStorage(element: any) {
    element.precio = element.precio.length === 0 ? [...this.cargarPrecio(element.precio)] : element.precio;
    console.log("que mierdas pasó?")
    this.operacionesMat("sumUnitario", element);
    this.localStorageService.setItem(element._id, JSON.stringify(element));
    this.dataSourceCargarArticulos = [...this.dataSourceCargarArticulos, JSON.parse(this.localStorageService.getItem(element._id)!)];
    this.operacionesMat("sumTotal", element);
    this.cantidadArticulos = this.dataSourceCargarArticulos.length
  }

  borrarArticuloStorage(element: any, i: number) {
    this.operacionesMat("resTotal", element);
    this.localStorageService.removeItem(element._id);
    this.dataSourceCargarArticulos.splice(i, 1);
    this.dataSourceCargarArticulos = [...this.dataSourceCargarArticulos];
    this.cantidadArticulos = this.dataSourceCargarArticulos.length
  }

  editandoArticuloStorage(element: any, i: number) {
    element.isEdit = true;
    //element.isEdit = element.isEdit? this.cancelarCambios(element) : true;
  }

  salvarEdicionArticuloStorage(element: any, i: number) {
    element.isEdit = false;
    this.localStorageService.removeItem(element._id);
    this.localStorageService.setItem(element._id, JSON.stringify(element));
    this.dataSourceCargarArticulos.splice(i, 1, JSON.parse(this.localStorageService.getItem(element._id)!));
    this.dataSourceCargarArticulos = [...this.dataSourceCargarArticulos];
  }

  cancelarCambios(element: any) {
    element.isEdit = false;
  }

  cargarPrecio(element: any) {
    element = [
      this.nuevoPrecio
    ]
    return element;
  }

  operacionesMat(param: string, element: any) {
    console.log("Porque se daña");
    try {
      if (param === "sumTotal") {
        console.log("entró")
        this.totalUnitario = (this.totalUnitario) + (Number(element.precio.subtotalCompra));
        this.totalIvaCompra = (this.totalIvaCompra) + (Number(element.precio.ivaCompra));
        this.subtotalCompra = (this.subtotalCompra) + (Number(element.precio.totalCompra));
        this.totalCompra = ((this.totalCompra) + (Number(element.precio.totalCompra))) - (this.nuevaCompra.descuento);
        console.log(this.totalUnitario, this.totalIvaCompra, this.subtotalCompra, this.totalCompra)
      }
      if (param === "resTotal") {
        console.log("entró")
        this.totalUnitario = 100;//(this.totalUnitario) - (Number(element.precio.subtotalCompra));
        this.totalIvaCompra = (this.totalIvaCompra) - (Number(element.precio.ivaCompra));
        this.subtotalCompra = (this.subtotalCompra) - (Number(element.precio.totalCompra));
        this.totalCompra = ((this.totalCompra) - (Number(element.precio.totalCompra))) - (this.nuevaCompra.descuento);
        console.log(this.totalUnitario, this.totalIvaCompra, this.subtotalCompra, this.totalCompra)
      }
      if (param === "sumUnitario") {
        element.precio.totalCompra = (Number(element.precio.ivaCompra) + Number(element.precio.ivaCompra));
        //this.totalCompraUnitario= ((+element.precio.cantidad) + (+element.precio.totalCompra));
        console.log(element.precio.totalCompra);
      }
    } catch (error) {
      console.log(error);
    }

  }

  refreshPage() {
    window.location.reload();
  }
}

export class compras {
  constructor(public No: String, public descripcion: String, public marca: string, public referencia: string,
    public precio: string, public descuento: string, public impuesto: string, public subtotal: string, public cantidad: string,
    public precioVenta: string, public total: string, public isEdit: boolean
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
