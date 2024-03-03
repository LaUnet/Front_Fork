import { Component, ViewChild, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TableUtilsService } from '../tableUtils.service';


@Component({
  selector: 'app-reportesDetalleArticulo',
  templateUrl: './reportesDetalleArticulos.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-CO' }],
})
export class ReportesDetalleArticulosComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService,
    public utilsService: UtilsService, private changeDetector: ChangeDetectorRef,
    private _adapter: DateAdapter<any>, public tableUtilsService: TableUtilsService,
    @Inject(MAT_DATE_LOCALE) private _locale: string ) { }

  columnas: string[] = ['No', 'codigoBarras', 'descripcion', 'referencia', 'marca', 'ubicacion', 'unidadMedida', 'stock', 'precioVenta', 'precioMayoreo'];

  isLoadingResults: boolean = false;
  mensajeExitoso: string = '';
  mensajeFallido: string = '';
  filtroArticulo: string = '';
  dataSourceArticulos: any;
  dataSourceMovimientos: any[] = [];
  opened: boolean = false;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [20, 40, 80, 100];
  startDate!: any;
  endDate!: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.buscarDetalleArticulo("20");
    this._locale = 'es-CO';
    this._adapter.setLocale(this._locale);

  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  async buscarDetalleArticulo(process: any) {
    this.mensajeFallido = "";
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };

    let httpParams = new HttpParams();
    httpParams = httpParams.append('stock', process);
    this.isLoadingResults = true;
    try {
      this.isLoadingResults = true;
      this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/inventories?${httpParams}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceArticulos = new MatTableDataSource(response.Data.docs);
            this.dataSourceArticulos.paginator = this.paginator;
            this.dataSourceArticulos.sort = this.sort;
          }
          this.isLoadingResults = false;
          this.dataSourceMovimientos = this.dataSourceArticulos.filteredData;
        }, error => {
          this.isLoadingResults = false;
          if (error.status === 401) {
            this.routerLinkLogin();
          }
          if (error.status === 404) {
            this.mensajeFallido = 'Parametros de consulta con resultados NO encontrados';
            return;
          }
          this.mensajeFallido = 'Error al consultar. Por favor, revisar la consola de Errores.';
          console.error('Error en la solicitud:', error);
        });
    } catch (error) {
      this.mensajeFallido = 'Error al consultar. Por favor, revisar la consola de Errores.';
      console.error('Error en la solicitud:', error);
    }
  }

  routerLinkLogin(): void {
    this.router.navigate(['/login'])
  };

  move(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnas, event.previousIndex, event.currentIndex);
  }

  exportTable() {
    this.tableUtilsService.exportToExcel(this.dataSourceArticulos.filteredData, "ReporteDetalleArticulos");
  }

  changeList(value: any) {
    this.buscarDetalleArticulo(value)
  }
}

export class Catalogo {
  constructor(public No: String, public codigoBarras: String,public descripcion: String, public marca: string, public referencia: string,
    public ubicacion: string, public unidadMedida: string, public stock: string, public precioVenta: string, public precioMayoreo: string
  ) { }
}