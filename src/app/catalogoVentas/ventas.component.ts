import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { DialogoCarItemComponent } from "../dialogo.carItem/dialogo.carItem.component";
import { MatSort } from '@angular/material/sort';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public dialogo: MatDialog,
    public localStorageService: LocalStorageService, private changeDetector: ChangeDetectorRef, public utilsService: UtilsService) { }

  columnas: string[] = ['descripcion', 'referencia', 'marca', 'ubicacion', 'unidadMedida', 'stock', 'precioventa', 'accion'];
  columnasCarItem: string[] = ['descripcion', 'cantidad', 'precio', 'total', 'isEdit'];

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
    totalArticulos: 0,
    totalArticulosArray: [],
    subtotalCompraMayoreo: 0,
    subtotalCompraMayoreoArray: [],

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
    this.localStorageToken = this.localStorageService.getItem('access_token');
    this.localStorageService.clear();
    this.localStorageService.setItem('access_token', this.localStorageToken);
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
    this.mensajeFallido = "";
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
            if (response.Data.totalDocs === 0) {
              this.mensajeFallido = 'Articulo no encontrado';
            }
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

  mostrarArticuloCarItem(element: any = [], i: number): void {
    element.isEdit = true;
    this.dialogo
      .open(DialogoCarItemComponent, {
        data: element
      })
      .afterClosed()
      .subscribe((confirmar: boolean) => {
        try {
          if (confirmar) {
            element.isEdit = false;
            this.changeQty(element, i, 0, 'replace');
          } else {
            element.isEdit = false;
          }
        } catch (error) {
          //alert("No hacer nada");
        }
        element.isEdit = false;
      });
  }

  mostrarMetodoPagoCarItem(): void {
    this.dialogo
      .open(DialogoCarItemComponent, {
        data: this.dataSourceCarItem
      })
      .afterClosed()
      .subscribe((confirmar: boolean) => {
        try {
          if (confirmar) {
            this.dataSourceCarItem.isEdit = false;
            this.changeQty(this.dataSourceCarItem, 1, 0, 'replace');
          } else {
            this.dataSourceCarItem.isEdit = false;
          }
        } catch (error) {
          //alert("No hacer nada");
        }
        this.dataSourceCarItem.isEdit = false;
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
    this.isLoadingResults = true;
    try {
      const response = await this.http.post(url, this.nuevoCliente, httpOptions).toPromise();
      this.isLoadingResults = false;
      this.mensajeExitosoCliente = "Cliente guardado exitosamente"
      setTimeout(() => {
        this.openedCustomer = false;
        this.setCliente();
      }, 3000);
    } catch (error) {
      this.isLoadingResults = false;
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

  borrarArticuloCarItem(element: any = [], i: number) {
    this.localStorageService.removeItem(element._id);
    this.dataSourceCarItem.splice(i, 1);
    this.dataSourceCarItem = [...this.dataSourceCarItem];
    this.operaciones.cantidadArticulos = this.dataSourceCarItem.length

    if (this.operaciones.cantidadArticulos > 0) {
      this.operaciones.totalArticulosArray.splice(i, 1);
      this.operaciones.totalArticulosArray = [...this.operaciones.totalArticulosArray];
      this.operaciones.totalArticulos = this.operaciones.totalArticulosArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
      this.operaciones.subtotalCompraArray.splice(i, 1);
      this.operaciones.subtotalCompraArray = [...this.operaciones.subtotalCompraArray];
      this.operaciones.subtotalCompra = this.operaciones.subtotalCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
      this.operaciones.descuentoCompraArray.splice(i, 1);
      this.operaciones.descuentoCompraArray = [...this.operaciones.descuentoCompraArray];
      this.operaciones.descuentoCompra = this.operaciones.descuentoCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
    } else {
      this.setOperaciones();
    }
  }

  addToCart(element: any = []) {
    if (JSON.parse(this.localStorageService.getItem(element._id)!)) {
      for (let i = 0; i < this.dataSourceCarItem.length; i++) {
        if (this.dataSourceCarItem[i]._id === element._id) {
          if ((this.dataSourceCarItem[i].detalleArticulo[0].cantidad + 1) > element.inventarios[0].stock) {
            alert(`No hay suficiente Stock ${element.inventarios[0].stock}, para la cantidad de productos solicitados ${this.dataSourceCarItem[i].detalleArticulo[0].cantidad + 1}!`)
            break
          }
          this.changeQty(this.dataSourceCarItem, i, 1, '');
          break
        }
      }
    } else {
      const addItem: number = 1;
      element =
      {
        "_id": element._id,
        "stock": element.inventarios[0].stock,
        "descripcion": element.descripcion,
        "mayoreo": false,
        "detalleArticulo": [
          {
            "codigo": element.codigo,
            "codigoBarras": element.codigoBarras,
            "cantidad": addItem,
            "precioVenta": element.precios[0].precioVenta,
            "precioMayoreo": element.precios[0].precioMayoreo,
            "descuento": element.precios[0].descuentoUnitario,
            "impuesto": element.precios[0].impuestoUnitario,
            "total": element.precios[0].precioVenta * addItem,
          }
        ]
      }
      this.localStorageService.setItem(element._id, JSON.stringify(element));
      this.dataSourceCarItem = [...this.dataSourceCarItem, JSON.parse(this.localStorageService.getItem(element._id)!)]
      this.operaciones.cantidadArticulos = this.dataSourceCarItem.length

      this.operaciones.totalArticulosArray = [...this.operaciones.totalArticulosArray, (parseInt(this.dataSourceCarItem[this.operaciones.cantidadArticulos - 1].detalleArticulo[0].cantidad))]
      this.operaciones.totalArticulos = this.operaciones.totalArticulosArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      this.operaciones.subtotalCompraArray = [...this.operaciones.subtotalCompraArray, (parseInt(this.dataSourceCarItem[this.operaciones.cantidadArticulos - 1].detalleArticulo[0].precioVenta) * parseInt(this.dataSourceCarItem[this.operaciones.cantidadArticulos - 1].detalleArticulo[0].cantidad))]
      this.operaciones.subtotalCompra = this.operaciones.subtotalCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      this.operaciones.descuentoCompraArray = [...this.operaciones.descuentoCompraArray, this.utilsService.calcularDescuento(this.operaciones.subtotalCompraArray[this.operaciones.cantidadArticulos - 1], this.dataSourceCarItem[this.operaciones.cantidadArticulos - 1].detalleArticulo[0].descuento)]
      this.operaciones.descuentoCompra = this.operaciones.descuentoCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
    }
  }

  changeQty(element: any = [], i: number, qty: any, process: any) {

    if (process === 'replace') {
      this.localStorageService.removeItem(element._id);
      this.dataSourceCarItem[i].detalleArticulo[0].total = element.mayoreo ? this.dataSourceCarItem[i].detalleArticulo[0].precioMayoreo * this.dataSourceCarItem[i].detalleArticulo[0].cantidad : this.dataSourceCarItem[i].detalleArticulo[0].precioVenta * this.dataSourceCarItem[i].detalleArticulo[0].cantidad;
      this.localStorageService.setItem(element._id, JSON.stringify(element));
      this.dataSourceCarItem.splice(i, 1, JSON.parse(this.localStorageService.getItem(this.dataSourceCarItem[i]._id)!));
      this.dataSourceCarItem = [...this.dataSourceCarItem];


      this.operaciones.totalArticulosArray.splice(i, 1, (parseInt(this.dataSourceCarItem[i].detalleArticulo[0].cantidad)));
      this.operaciones.totalArticulosArray = [...this.operaciones.totalArticulosArray];
      this.operaciones.totalArticulos = this.operaciones.totalArticulosArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      this.operaciones.subtotalCompraArray.splice(i, 1, (parseInt(this.dataSourceCarItem[i].detalleArticulo[0].precioVenta) * parseInt(this.dataSourceCarItem[i].detalleArticulo[0].cantidad)));
      this.operaciones.subtotalCompraArray = [...this.operaciones.subtotalCompraArray];
      this.operaciones.subtotalCompra = this.operaciones.subtotalCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

      if (element.mayoreo) {
        this.operaciones.descuentoCompraArray.splice(i, 1, this.utilsService.calcularDescuentoMayoreo(this.operaciones.subtotalCompraArray[i], this.utilsService.multiplicarNumero(this.dataSourceCarItem[i].detalleArticulo[0].precioMayoreo, this.dataSourceCarItem[i].detalleArticulo[0].cantidad)));
      } else {
        this.operaciones.descuentoCompraArray.splice(i, 1, this.utilsService.calcularDescuento(this.operaciones.subtotalCompraArray[i], this.dataSourceCarItem[i].detalleArticulo[0].descuento));
      }
      this.operaciones.descuentoCompraArray = [...this.operaciones.descuentoCompraArray];
      this.operaciones.descuentoCompra = this.operaciones.descuentoCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
      return;
    } else {
      if ((this.dataSourceCarItem[i].detalleArticulo[0].cantidad + qty) > element.stock) {
        alert(`No hay suficiente Stock ${element.stock}, para la cantidad de productos solicitados ${(this.dataSourceCarItem[i].detalleArticulo[0].cantidad + qty)}!`)
        return;
      }
      if ((this.dataSourceCarItem[i].detalleArticulo[0].cantidad + qty) === 0) {
        this.borrarArticuloCarItem(this.dataSourceCarItem[i], i);
        return;
      }

      this.dataSourceCarItem[i].detalleArticulo[0].cantidad = this.dataSourceCarItem[i].detalleArticulo[0].cantidad + qty;
    }
    this.localStorageService.removeItem(this.dataSourceCarItem[i]._id);
    this.dataSourceCarItem[i].detalleArticulo[0].total = this.dataSourceCarItem[i].mayoreo ? this.dataSourceCarItem[i].detalleArticulo[0].precioMayoreo * this.dataSourceCarItem[i].detalleArticulo[0].cantidad : this.dataSourceCarItem[i].detalleArticulo[0].precioVenta * this.dataSourceCarItem[i].detalleArticulo[0].cantidad;
    this.localStorageService.setItem(this.dataSourceCarItem[i]._id, JSON.stringify(this.dataSourceCarItem[i]));
    this.dataSourceCarItem.splice(i, 1, JSON.parse(this.localStorageService.getItem(this.dataSourceCarItem[i]._id)!));
    this.dataSourceCarItem = [...this.dataSourceCarItem];

    this.operaciones.totalArticulosArray.splice(i, 1, (parseInt(this.dataSourceCarItem[i].detalleArticulo[0].cantidad)));
    this.operaciones.totalArticulosArray = [...this.operaciones.totalArticulosArray];
    this.operaciones.totalArticulos = this.operaciones.totalArticulosArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);


    this.operaciones.subtotalCompraArray.splice(i, 1, this.utilsService.multiplicarNumero(this.dataSourceCarItem[i].detalleArticulo[0].precioVenta, this.dataSourceCarItem[i].detalleArticulo[0].cantidad));
    this.operaciones.subtotalCompraArray = [...this.operaciones.subtotalCompraArray];
    this.operaciones.subtotalCompra = this.operaciones.subtotalCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

    if (this.dataSourceCarItem[i].mayoreo) {
      this.operaciones.descuentoCompraArray.splice(i, 1, this.utilsService.calcularDescuentoMayoreo(this.operaciones.subtotalCompraArray[i], this.utilsService.multiplicarNumero(this.dataSourceCarItem[i].detalleArticulo[0].precioMayoreo, this.dataSourceCarItem[i].detalleArticulo[0].cantidad)));
    } else {
      this.operaciones.descuentoCompraArray.splice(i, 1, this.utilsService.calcularDescuento(this.operaciones.subtotalCompraArray[i], this.dataSourceCarItem[i].detalleArticulo[0].descuento));
    }
    this.operaciones.descuentoCompraArray = [...this.operaciones.descuentoCompraArray];
    this.operaciones.descuentoCompra = this.operaciones.descuentoCompraArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
  }

  cancelarCambios(element: any, i: number) {
    element.isEdit = false;
    this.dataSourceCarItem.splice(i, 1, JSON.parse(this.localStorageService.getItem(element._id)!));
    this.dataSourceCarItem = [...this.dataSourceCarItem];
  }

  setOperaciones() {
    this.operaciones.cantidadArticulos = 0,
      this.operaciones.subtotalCompra = 0,
      this.operaciones.subtotalCompraArray = [],
      this.operaciones.impuestoCompra = 0,
      this.operaciones.impuestoCompraArray = [],
      this.operaciones.descuentoCompra = 0,
      this.operaciones.descuentoCompraArray = [],
      this.operaciones.totalCompra = 0,
      this.operaciones.totalCompraArray = [],
      this.operaciones.totalArticulos = 0,
      this.operaciones.totalArticulosArray = []
  };

}

export class Catalogo {
  constructor(public descripcion: String, public marca: string, public referencia: string,
    public ubicacion: string, public unidadMedida: string, public stock: string, public precioventa: string
  ) { }
}

export class carItem {
  constructor(public descripcion: String, public cantidad: string, public precio: string, public iva: string, public total: string, public isEdit: string) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
