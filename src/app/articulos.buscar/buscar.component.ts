import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component"




@Component({
  selector: 'app-buscarArticulo',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class buscarArticuloComponent {


  constructor(private http: HttpClient,  private tokenService: TokenService, public dialogo:MatDialog) { }


  columnas: string[] = ['codigo', 'codigoBarras', 'descripcion', 'marca', 'referencia', 'unidadMedida', 'codigoUbicacion', 'accion'];

  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [10];
  isLoadingResults : boolean = false;
  opened: boolean = false;
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  ubicaciones: any[] = [];
  dataSourceArticulos:any;
  dataSourceUbicaciones:any; 

  ngOnInit() {
    this.buscarArticulo();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  async buscarArticulo() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles', httpOptions )
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceArticulos = new MatTableDataSource(response.Data.docs);
          this.dataSourceArticulos.paginator = this.paginator;
          this.pageSize=response.Data.docs.limit;
          this.pageIndex=response.Data.docs.page;
          this.length = response.Data.totalDocs;
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

  async recargarArticulo(page: PageEvent) {
    this.dataSourceArticulos = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceArticulos = new MatTableDataSource(response.Data.docs);
          this.pageIndex=response.Data.docs.page;
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
 
    cargarUbicaciones() {
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
            this.dataSourceUbicaciones = response.Data.docs;
          }else{
            this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
            console.error('Error en la solicitud:', response);
          }
        });       
      } catch (error) {
        this.mensajeFallido = 'Error al consultar. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);       
      }  
    }

    async borrar(id: string){
      const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${id}`
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`,
        })
      };
      try {
        const response = await this.http.delete(url, httpOptions).toPromise();
        this.mensajeExitoso = "Registro Eliminado exitosamente"
        setTimeout(() => {
          this.refreshPage();
        }, 3000);
      } catch (error) {
        this.mensajeFallido = 'Error al Eliminar. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }
    }
  
    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSourceArticulos.filter = filtro.trim().toLowerCase();
    } 
  
    mostrarDialogo(id:string): void {
      this.dialogo
        .open(DialogoConfirmacionComponent, {
          data: `Seguro deseas ELIMINARLO?`
        })
        .afterClosed()
        .subscribe((confirmar: Boolean) => {
          if (confirmar) {
            this.borrar(id)
          } else {
            //alert("No hacer nada");
          }
        });
    }

  refreshPage() {
    window.location.reload();
  }
  
}


export class Articulo {
  constructor(public codigo: string, public codigoBarras: string, public descripcion: String,
              public marca: string, public referencia: string, public unidadMedida: String,
              public codigoUbicacion: string, public estadoActivo: boolean
              ){}
}