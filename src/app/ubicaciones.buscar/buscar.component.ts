import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component"



@Component({
  selector: 'app-buscarUbicacion',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class buscarUbicacionComponent {


  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService, public dialogo: MatDialog) { }


  columnas: string[] = ['codigo', 'nombreZona', 'numeroZona', 'numeroEstanteria', 'numeroUbicacion' , 'estadoActivo', 'accion'];

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
  dataSourceUbicaciones:any;


  ngOnInit() {
    this.buscarUbicacion();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  async buscarUbicacion() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions )
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceUbicaciones = new MatTableDataSource(response.Data.docs);
          this.dataSourceUbicaciones.paginator = this.paginator;
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

  async recargarUbicacion(page: PageEvent) {
    this.dataSourceUbicaciones = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.isLoadingResults = true;
      this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceUbicaciones = new MatTableDataSource(response.Data.docs);
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

  borrar(id: string) {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    try {
      this.http.delete<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations/${id}`, httpOptions )
      .subscribe(response => {
        if (response.Status) {
          this.mensajeExitoso = "Eliminado exitosamente"
          setTimeout(() => {
            this.refreshPage();
          }, 3000);
        }else{
          this.mensajeFallido = 'Error al eliminar. Por favor, inténtelo nuevamente.';
          console.error('Error en la solicitud:', response);
        }
      });
    } catch (error) {
      this.mensajeFallido = 'Error al eliminar. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  };

  filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceUbicaciones.filter = filtro.trim().toLowerCase();
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


export class Ubicacion {
  constructor(public codigo: string, public nombreZona: string, public numeroZona: String,
              public numeroEstanteria: string, public numeroUbicacion: string, public estadoActivo: boolean
              ){}
}
