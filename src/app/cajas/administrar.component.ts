import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { DialogoArticuloComponent } from "../dialogo.articulo/dialogo.articulo.component";
import { NavigationEnd, Router } from '@angular/router';
import { Target } from '@angular/compiler';
import { LocalStorageService } from '../local-storage.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs';
import { UtilsService } from '../utils.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

/** Setear fechas */
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-administrarCaja',
  templateUrl: './administrar.component.html',
  styleUrls: ['./caja.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-CO' }],
})

export class AdministrarCajaComponent {

  constructor(private router: Router, private http: HttpClient, public tokenService: TokenService, public dialogo: MatDialog,
    public localStorageService: LocalStorageService, private changeDetector: ChangeDetectorRef, public utilsService: UtilsService,
    @Inject(MAT_DATE_LOCALE) private _locale: string,) { }


  columnas: string[] = ['No', 'tipo', 'razon', 'fecha', 'valor', 'user', 'observacion'];

  openedMenu!: boolean;
  dataSourceMovimientos: any = [];
  dataSourceCajas: any = [];

  isLoadingResults: boolean = false;
  //Pagination
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [20];
  subscriber!: Subscription;
  //IvaIncluido Valor Unitario
  ventaInterna: String = "INT";
  //Datos para operaciones
  startDate!: any;
  endDate!: any;
  fieldStartDate: string = '';
  fieldEndDate: string = '';
  id!: any; 


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
   * Control Error Textfields Providers
   */
  nombreFormControl = new FormControl('', [Validators.required]);
  tipoCajaFormControl = new FormControl('', [Validators.required]);
  baseAperturaFormControl = new FormControl('', [Validators.required]);
  consumoInternoFormControl = new FormControl('', [Validators.required]);
  tipoMovimientoFormControl = new FormControl('', [Validators.required]);
  valorMovimientoFormControl = new FormControl('', [Validators.required]);
  razonMovimientoFormControl = new FormControl('', [Validators.required]);
  totalFormControl = new FormControl('', [Validators.required]);
  tipoFormControl = new FormControl('', [Validators.required]);
  razonDocumentoFormControl = new FormControl('', [Validators.required]);
  fechaRazonSocialFormControl = new FormControl('', [Validators.required]);
  valorFormControl = new FormControl('', [Validators.required]);
  userFormControl = new FormControl('', [Validators.required]);
  observacionFormControl = new FormControl('', [Validators.required]);

  nuevaCaja: any = {
    nombre: '',
    tipoCaja: '',
    baseApertura: '',
    consumoInterno: '',
    tipoMovimiento:'',
    razonMovimiento:'',
    valorMovimiento:'',
    observacionMovimiento:'',
    total: '',
    tipo: '',
    razon: '',
    fecha: '',
    valor: '',
    user: '',
    observacion: '',
  };

  matcher = new MyErrorStateMatcher();
  mensajeExitosoArticulo: string = '';
  mensajeFallidoArticulo: string = '';
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  fechaInicial = new FormGroup({
    start: new FormControl(new Date(year, month, day)),
    end: new FormControl(new Date(year, month, day + 1)),
  });


  ngOnInit() {
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => { });
    this.buscarCaja();
  }

  ngOnDestroy() {
    this.subscriber?.unsubscribe();
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  async buscarCaja() {
    this.startDate = new Date(year, month, day);
    this.endDate = new Date(year, month, day + 1);
    console.log(this.startDate, this.endDate)
    //const token = this.tokenService.token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M3YzI2ZDI5NDRiMmM2MWFiZWQ5NCIsImlhdCI6MTcxMTkxMjk5NCwiZXhwIjoxNzExOTk5Mzk0fQ.eRKyw3ja99dvDJ_ibT4kBllNFK0ejnpnGy32rICYA_s"
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    try {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('startDate', this.startDate);
      httpParams = httpParams.append('endDate', this.endDate);
      //this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/cashierMovements?${httpParams}`, httpOptions)
      this.http.get<any>(`http://localhost:3030/api/cashierMovements?${httpParams}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceCajas = response.Data.filter(((arr: { estadoActivo: any; }) => arr.estadoActivo === true))
          }
          this.isLoadingResults = false;
          switch (this.dataSourceCajas.length) {
            case 0:
              alert("No Existe Caja Abierta")
              return;
            case 1:
              console.log(this.dataSourceCajas)
              this.nuevaCaja.nombre = this.dataSourceCajas[0].nombreCaja
              this.nuevaCaja.tipoCaja = this.dataSourceCajas[0].tipoCaja
              this.nuevaCaja.baseApertura = this.dataSourceCajas[0].baseApertura
              this.dataSourceMovimientos = this.dataSourceCajas[0].movimientos
              if (this.dataSourceMovimientos.length > 0) {
                this.dataSourceMovimientos = this.dataSourceMovimientos.filter(((arr: { razon: any; }) => arr.razon === this.ventaInterna))
                this.nuevaCaja.consumoInterno += this.dataSourceMovimientos.map((t: { valor: string | number; }) => +t.valor).reduce((acc: any, value: any) => acc + value, 0);
                this.dataSourceMovimientos = this.dataSourceCajas[0].movimientos
                this.dataSourceMovimientos = this.dataSourceMovimientos.filter(((arr: { razon: any; }) => arr.razon !== this.ventaInterna))
                this.nuevaCaja.total += this.dataSourceMovimientos.map((t: { valor: string | number; }) => +t.valor).reduce((acc: any, value: any) => acc + value, 0);
                this.dataSourceMovimientos = this.dataSourceCajas[0].movimientos
              }
              return;
            default:
              alert("Mas de una caja abierta");
              return;
          }
        }, error => {
          this.isLoadingResults = false;
          if (error.status === 401) {
            this.routerLinkLogin();
          }
          if (error.status === 404) {
            alert("No Existe Caja Abierta")
            return;
          }
          console.error('Error en la solicitud:', error);
        });
    } catch (error) {
      this.isLoadingResults = false;
      this.mensajeFallido = 'Error al consultar. Por favor, revisar la consola de Errores.';
      console.error('Error en la solicitud:', error);
    }
  }

  async buscarMovimientos() {
    //const token = this.tokenService.token;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M3YzI2ZDI5NDRiMmM2MWFiZWQ5NCIsImlhdCI6MTcxMTkxMjk5NCwiZXhwIjoxNzExOTk5Mzk0fQ.eRKyw3ja99dvDJ_ibT4kBllNFK0ejnpnGy32rICYA_s"
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    try {
      let httpParams = new HttpParams();
      if(this.startDate && this.endDate){
      httpParams = httpParams.append('startDate', this.startDate);
      httpParams = httpParams.append('endDate', this.endDate);
    }
      //this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/cashierMovements/${id}`, httpOptions)
      this.http.get<any>(`http://localhost:3030/api/cashierMovements/${this.id}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceMovimientos = response.Data.movimientos;
          }
          this.isLoadingResults = false;

        }, error => {
          this.isLoadingResults = false;
          if (error.status === 401) {
            this.routerLinkLogin();
          }
          if (error.status === 404) {
            alert("No Existe Caja Abierta")
            return;
          }
          console.error('Error en la solicitud:', error);
        });
    } catch (error) {
      this.isLoadingResults = false;
      this.mensajeFallido = 'Error al consultar. Por favor, revisar la consola de Errores.';
      console.error('Error en la solicitud:', error);
    }
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
            this.routerLinkCaja();
          }
          if (process === 2) {
            this.refreshPage();
          }
          if (process === 3) {
            //alert("No hacer nada");
          }
        } else { }
      });
  }

  routerLinkCaja(): void {
    this.router.navigate(['/registrarCaja'])
  };

  routerLinkLogin(): void {
    this.router.navigate(['/login'])
    this.localStorageService.clear();
  };

  filtrarCaja(event: Event) {
    const filtro = (event as Target as HTMLInputElement).value;
    return this.dataSourceCajas.filter = filtro.trim().toLowerCase().includes;
  }

  applyFilter() {
    //this.buscarVenta(this.utilsService.getDate(this.startDate), this.utilsService.getDate(this.endDate))
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = type === 'Start' ? event.value : this.startDate;
    this.endDate = type === 'End' ? event.value : null;
  }

  applyClear() {
    this.fieldStartDate = '';
    this.fieldEndDate = '';
    //this.buscarVenta(null, null)

  }

  refreshPage() {
    window.location.reload();
  }

}

export class compras {
  constructor(public No: String, public tipo: String, public razon: string, public fecha: Date,
    public valor: Number, public user: string, public observación: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
