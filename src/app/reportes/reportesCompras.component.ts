import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-reportesVentas',
  templateUrl: './reportesCompras.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComprasComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService,
    public utilsService: UtilsService, private changeDetector: ChangeDetectorRef,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,) { }

    
  columnas: string[] = ['No', 'numeroFactura', 'fechaFactura', 'fechaIngreso', 'valorTransaccion', 'nombreRazonSocial', 'tipoDocumento', 'numeroDocumento'];

  isLoadingResults: boolean = false;
  mensajeExitoso: string = '';
  mensajeFallido: string = '';
  dataSourceCompras: any;
  dataSourceMovimientos: any[] = [];
  opened: boolean = false;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [14, 40, 80, 100];
  startDate!: any;
  endDate!: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.buscarCompra(null, null);
    this._locale = 'es-CO';
    this._adapter.setLocale(this._locale);
  }


  async buscarCompra(startDate: any, endDate: any) {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      let httpParams = new HttpParams();
      if (endDate !== null)
      {
        httpParams.append('startDate', startDate);
        httpParams.append('endDate', endDate);
      }
      this.isLoadingResults = true;
      this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/purchases?${httpParams}`, httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceCompras = new MatTableDataSource(response.Data.docs);
            this.dataSourceCompras.paginator = this.paginator;
            this.dataSourceCompras.sort = this.sort;
          }
          this.isLoadingResults = false;
          this.dataSourceMovimientos = this.dataSourceCompras.filteredData;
        }, error => {
          this.isLoadingResults = false;
          if (error.status === 401) {
            this.routerLinkLogin();
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

  getTotalTransactiones() {
    return this.dataSourceMovimientos.map(t => +t.total).reduce((acc, value) => acc + value, 0);
  }

  move(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnas, event.previousIndex, event.currentIndex);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = type === 'Start' ? event.value : this.startDate;
    this.endDate = type === 'End' ? event.value : this.endDate;
  }

}

export interface Transaction {
  No: string,
  numeroFactura: string;
  fechaFactura: Date;
  fechaIngreso: Date;
  valorTransaccion: number;
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
}