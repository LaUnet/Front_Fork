import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LiveAnnouncer } from '@angular/cdk/a11y';


@Component({
  selector: 'app-reportesVentas',
  templateUrl: './reportesCompras.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComprasComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public utilsService: UtilsService, private changeDetector: ChangeDetectorRef) { }

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

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.buscarCompra();
  }


  async buscarCompra() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>('https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/purchases', httpOptions)
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