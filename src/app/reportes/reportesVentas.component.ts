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
  templateUrl: './reportesVentas.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesVentasComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public utilsService: UtilsService, private changeDetector: ChangeDetectorRef) { }

  columnas: string[] = ['No', 'numeroFactura', 'fechaFactura', 'efectivo', 'transferencia', 'valorTransaccion', 'nombreRazonSocial', 'tipoDocumento', 'numeroDocumento', 'facturaElectronica', 'vendedor'];

  isLoadingResults: boolean = false;
  mensajeExitoso: string = '';
  mensajeFallido: string = '';
  dataSourceVentas: any;
  dataSourceMovimientos: any[] = [];
  opened: boolean = false;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [20, 40, 80, 100];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.buscarVenta();
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    
  }

  async buscarVenta() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>('https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/sales', httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceVentas = new MatTableDataSource(response.Data.docs);
            this.dataSourceVentas.paginator = this.paginator;
            this.dataSourceVentas.sort = this.sort;
          }
          this.isLoadingResults = false;
          this.dataSourceMovimientos = this.dataSourceVentas.filteredData;
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

  /** Gets the total cost of all transactions. */
  getTotalEfectivo() {
    return this.dataSourceMovimientos.map(t => +t.cantidadEfectivo).reduce((acc, value) => acc + value, 0);
  }

  getTotalTransferencias() {
    return this.dataSourceMovimientos.map(t => +t.cantidadTransferencia).reduce((acc, value) => acc + value, 0);
  }

  getTotalTransactiones() {
    return this.dataSourceMovimientos.map(t => +t.total).reduce((acc, value) => acc + value, 0);
  }

  move(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnas, event.previousIndex, event.currentIndex);
  }

}

export interface Transaction {
  No: string,
  isVenta: boolean;
  numeroFactura: Date;
  fechaFactura: Date;
  efectivo: number;
  transferencia: number;
  valorTransaccion: number;
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
  facturaElectronica: string;
  vendedor: string;
}
