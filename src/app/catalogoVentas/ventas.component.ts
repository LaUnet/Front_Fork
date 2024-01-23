import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { MatSort } from '@angular/material/sort';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs';
import { UtilsService } from '../utils.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public dialogo: MatDialog,
    public localStorageService: LocalStorageService, private changeDetector: ChangeDetectorRef, public utilsService: UtilsService) { }

  columnas: string[] = ['descripcion', 'referencia', 'marca', 'ubicacion', 'unidadMedida', 'stock', 'precioventa', 'accion'];
  columnasCarItem: string[] = ['descripcion', 'cantidad', 'precio', 'iva', 'total', 'isEdit'];

  openedMenu!: boolean;
  openedCustomer!: boolean;
  dataSourceCatalogo: any = [];
  dataSourceClientes: any = [];
  dataSourceCarItem: any = [];
  isLoadingResults: boolean = false;
  //Pagination
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [20];
  //Busquedas
  searchDescription!: boolean;
  searchCode!: boolean;
  //Storage
  localStorageToken !: any;
  subscriber!: Subscription;
  vector: number = 0;
  //Calculos
  operaciones: any = {
    cantidadArticulos: 0,
    subtotalCompra: 0,
    subtotalCompraArray: [],
    impuestoCompra: 0,
    impuestoCompraArray: [],
    descuentoCompra: 0,
    descuentoCompraArray: [],
    totalCompra: 0,
    totalCompraArray: [],
  }


  /**
   * Control Error Textfields Articles
   */
  codigoBarrasFormControl = new FormControl('', [Validators.required]);
  descripcionFormControl = new FormControl('', [Validators.required]);
  marcaFormControl = new FormControl('', [Validators.required]);
  referenciaFormControl = new FormControl('', [Validators.required]);
  unidadMedidaFormControl = new FormControl('', [Validators.required]);
  codigoUbicacionFormControl = new FormControl('', [Validators.required]);
  nuevoArticulo = {
    codigoBarras: '',
    descripcion: '',
    unidadMedida: '',
    codigoUbicacion: '',
    marca: '',
    referencia: ''
  };

  /**
 * Control Error Textfields Customers
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
  tipoClienteFormControl = new FormControl('', [Validators.required]);

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
    tipoCliente: '',
    barrio: ''
  };

  /**
* Control Error Textfields Consultas
*/

  buscarDescripcionFormControl = new FormControl('', [Validators.required]);
  buscarCodigoBarrasFormControl = new FormControl('', [Validators.required]);

  nuevaBusqueda: any = {
    buscarDescripcion: '',
    buscarCodigoBarras: '',
  };

  matcher = new MyErrorStateMatcher();
  mensajeExitoso: string = '';
  mensajeFallido: string = '';
  mensajeExitosoCliente: string = '';
  mensajeFallidoCliente: string = '';

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => { });
  }

  ngOnDestroy() {
    this.subscriber?.unsubscribe();
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  async buscarCliente() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };

    let httpParams = new HttpParams();
    httpParams = httpParams.append('numeroDocumento', this.nuevoCliente.numeroDocumento);
    this.isLoadingResults = true;
    try {
      this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers?${httpParams}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceClientes = response.Data.docs.length > 0 ? response.Data.docs : null;
            this.nuevoCliente.nombreRazonSocial = this.dataSourceClientes !== null ? this.dataSourceClientes[0].nombreRazonSocial : "NO EXISTE"
            this.nuevoCliente.tipoDocumento = this.dataSourceClientes !== null ? this.dataSourceClientes[0].tipoDocumento : "NO EXISTE"
            this.nuevoCliente.numeroDocumento = this.dataSourceClientes !== null ? this.dataSourceClientes[0].numeroDocumento : null
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

  async buscarCatalogo(tipo: number) {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };

    let httpParams = new HttpParams();
    httpParams = tipo < 1 ? httpParams.append('descripcion', this.nuevaBusqueda.buscarDescripcion) : httpParams.append('codigoBarras', this.nuevaBusqueda.buscarCodigoBarras);
    this.isLoadingResults = true;
    try {
      this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle?${httpParams}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
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
    async recargarCatalogo(page: PageEvent) {
      this.dataSourceCatalogo = new MatTableDataSource;
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`,
        })
      };
      this.isLoadingResults = true;
      this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
            this.pageIndex = response.Data.docs.page;
          }
          this.isLoadingResults = false;
        });
    }
   */

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceCatalogo.filter = filtro.trim().toLowerCase();
    this.isLoadingResults = false;
  }

  mostrarDialogo(message: string, process: number, element: any, i: number): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: message
      })
      .afterClosed()
      .subscribe((confirmar: Boolean) => {
        if (confirmar) {
          if (process === 1) {
            this.routerLinkArticulo();
          }
          if (process === 2) {
            this.refreshPage();
          }
          if (process === 3) {
            this.borrarArticuloCarItem(element, i);
          }
        } else {
          //alert("No hacer nada");
        }
      });
  }

  async guardarCliente() {
    this.mensajeFallidoCliente = "";
    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers`
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    this.isLoadingResults= true;
    try {
      const response = await this.http.post(url, this.nuevoCliente, httpOptions).toPromise();
      this.isLoadingResults= false;
      this.mensajeExitosoCliente = "Cliente guardado exitosamente"
      setTimeout(() => {
        this.openedCustomer = false;
        this.setCliente();
      }, 3000);
    } catch (error) {
      this.isLoadingResults= false;
      this.mensajeFallidoCliente = 'Error al guardar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  setCliente() {
    this.nuevoCliente.tipoDocumento = '';
    this.tipoDocumentoFormControl.reset();
    this.nuevoCliente.numeroDocumento = '';
    this.numeroDocumentoFormControl.reset();
    this.nuevoCliente.nombreRazonSocial = '';
    this.nombreRazonSocialFormControl.reset();
    this.nuevoCliente.telefono = '';
    this.telefonoFormControl.reset();
    this.nuevoCliente.direccion = '';
    this.direccionFormControl.reset();
    this.nuevoCliente.departamento = '';
    this.departamentoFormControl.reset();
    this.nuevoCliente.municipio = '';
    this.municipioFormControl.reset();
    this.nuevoCliente.email = '';
    this.emailFormControl.reset();
    this.nuevoCliente.tipoCliente = '';
    this.tipoClienteFormControl.reset();
    this.nuevoCliente.barrio.reload = '';
    this.barrioFormControl.reset();
    this.mensajeExitosoCliente = '';
    this.mensajeFallidoCliente = '';
  };

  routerLinkArticulo(): void {
    this.router.navigate(['/registrarArticulo'])
  };
  routerLinkLogin(): void {
    this.router.navigate(['/login'])
    this.localStorageService.clear();
  };

  refreshPage() {
    window.location.reload();
  }

  saveToLocalStorage(element: any = []) {
    console.log("datos recibidos", element)
  }

  retrieveFromLocalStorage() {
    this.localStorageService.getItem('myKey');
  }

  borrarArticuloCarItem(element: any = [], i: number) {
    //this.localStorageService.removeItem(element._id);
    this.dataSourceCarItem.splice(i, 1);
    this.dataSourceCarItem = [...this.dataSourceCarItem];
    this.operaciones.cantidadArticulos = this.dataSourceCarItem.length

    if (i > 0) {
      /**
      this.operaciones.subtotalCompraArray.splice(i, 1);
      this.operaciones.subtotalCompraArray = [...this.operaciones.subtotalCompraArray];
      this.operaciones.subtotalCompra = this.operaciones.subtotalCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      this.operaciones.impuestoCompraArray.splice(i, 1);
      this.operaciones.impuestoCompraArray = [...this.operaciones.impuestoCompraArray];
      this.operaciones.impuestoCompra = this.operaciones.impuestoCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      this.operaciones.descuentoCompraArray.splice(i, 1);
      this.operaciones.descuentoCompraArray = [...this.operaciones.descuentoCompraArray];
      this.operaciones.descuentoCompra = this.operaciones.descuentoCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      this.operaciones.totalCompraArray.splice(i, 1);
      this.operaciones.totalCompraArray = [...this.operaciones.totalCompraArray];
      this.operaciones.totalCompra = this.operaciones.totalCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
       */
    } else {
      //this.setOperaciones();
    }
  }

  addToCart(element: any = [], index: any) {
    
    
    this.dataSourceCarItem = [...this.dataSourceCarItem,
    {
      "_id": element._id,
      "cantidad": 1,
      "descripcion": element.descripcion,
      "detalleArticulo": [
        {
          "codigo": element.codigo,
          "codigoBarras": element.codigoBarras,          
          "cantidad": 0,
          "precioVenta": element.precios[0].precioVenta,
          "descuento": element.precios[0].descuentoUnitario,
          "impuestoUnitario": element.precios[0].impuestoUnitario,
          "total": element.precios[0].precioVenta
        }
      ]
    }
    ]
    this.operaciones.cantidadArticulos = this.dataSourceCarItem.length
  }

  changeQty(a: any, b: any, c: any) { }

  total(element: any [], index: number) {
    this.dataSourceCarItem[index].detalleArticulo[0].total = this.utilsService.calculartotal(this.utilsService.calcularSubtotal(element[index].detalleArticulo[0].precioVenta, element[index].cantidad, element[index].detalleArticulo[0].impuestoUnitario), element[index].detalleArticulo[0].descuentoUnitario);
  }
}

export class Catalogo {
  constructor(public descripcion: String, public marca: string, public referencia: string,
    public ubicacion: string, public unidadMedida: string, public stock: string, public precioventa: string
  ) { }
}

export class carItem {
  constructor(public descripcion: String, public cantidad: string, public iva: string, public total: string, public isEdit: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
