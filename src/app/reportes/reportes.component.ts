import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements AfterViewInit{

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public utilsService: UtilsService) 
  {}

  columnas: string[] = ['No','tipoTransaccion', 'numeroFactura', 'fechaFactura', 'efectivo', 'transferencia', 'valorTransaccion', 'nombreRazonSocial'];

  isLoadingResults: boolean = false;
  mensajeExitoso: string = '';
  mensajeFallido: string = '';
  dataSourceComras: any = new MatTableDataSource;
  dataSourceVentas: any = new MatTableDataSource;
  dataSourceMovimientos: any[] = [];  
  dataSourceFinal: any;
  opened: boolean = false;
  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [20, 40, 80, 100];

    
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.buscarVenta();
  }

  ngAfterViewInit() {
    this.dataSourceFinal.sort = this.sort;
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
            this.dataSourceVentas = response.Data.docs;
            for (let i = 0; i < this.dataSourceVentas.length; i++) {
              this.dataSourceMovimientos[i] =
              {
                "tipoTransaccion": "Venta",
                "numeroFactura": this.dataSourceVentas[i].numeroFactura,
                "fechaFactura": this.dataSourceVentas[i].fechaFactura,
                "efectivo": +this.dataSourceVentas[i].cantidadEfectivo,
                "transferencia": +this.dataSourceVentas[i].cantidadTransferencia,
                "valorTransaccion": +this.dataSourceVentas[i].total,
                "nombreRazonSocial": this.dataSourceVentas[i].cliente.nombreRazonSocial
              }
            }
          }
          this.isLoadingResults = false;
          this.buscarCompra();
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
            this.dataSourceComras = response.Data.docs;
            for (let i = 0; i < this.dataSourceComras.length; i++) {
              this.dataSourceMovimientos = [...this.dataSourceMovimientos,
              {
                "tipoTransaccion": "Compra",
                "numeroFactura": this.dataSourceComras[i].numeroFactura,
                "fechaFactura": this.dataSourceComras[i].fechaIngreso,
                "efectivo": 0,
                "transferencia": 0,
                "valorTransaccion": -this.dataSourceComras[i].total,
                "nombreRazonSocial": this.dataSourceComras[i].proveedor.nombreRazonSocial
              }
              ];
            }
          }
          this.isLoadingResults = false;
          this.dataSourceFinal = new MatTableDataSource(this.dataSourceMovimientos);
          this.dataSourceFinal.paginator = this.paginator;
          this.dataSourceFinal.sort = this.sort;

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

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFinal.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceFinal.paginator) {
      this.dataSourceFinal.paginator.firstPage();
    }
  }

  /** Gets the total cost of all transactions. */
  getTotalEfectivo() {
    return  this.dataSourceMovimientos.map(t => t.efectivo).reduce((acc, value) => acc + value, 0);
  }

  getTotalTransferencias() {
    return  this.dataSourceMovimientos.map(t => t.transferencia).reduce((acc, value) => acc + value, 0);
  }

  getTotalTransactiones(){
    return this.dataSourceMovimientos.map(t => t.valorTransaccion).reduce((acc, value) => acc + value, 0);
  }

  move(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnas, event.previousIndex, event.currentIndex);
  }

}

export interface Transaction {
  No: string,
  tipoTransaccion: string;
  numeroFactura: Date;
  fechaFactura: Date;
  efectivo: number;
  transferencia: number;
  valorTransaccion: number;
  nombreRazonSocial: string;
}