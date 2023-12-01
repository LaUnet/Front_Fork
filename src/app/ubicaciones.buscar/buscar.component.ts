import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-buscarUbicacion',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class buscarUbicacionComponent {


  constructor(private router: Router, private http: HttpClient,  private tokenService: TokenService, public dialog:MatDialog) { }


  columnas: string[] = ['codigo', 'nombreZona', 'numeroZona', 'numeroEstanteria', 'numeroUbicacion' , 'estadoActivo', 'accion'];

  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [10];
  isLoadingResults : boolean = true;
  opened: boolean = false;
  openedEdit: boolean = false;


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
    this.isLoadingResults = true;
    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceUbicaciones = new MatTableDataSource(response.Data.docs);
        this.dataSourceUbicaciones.paginator = this.paginator;
        this.pageSize=response.Data.docs.limit;
        this.pageIndex=response.Data.docs.page;
        this.length = response.Data.totalDocs;
      }
      this.isLoadingResults = false; 
    });
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
    this.isLoadingResults = true;
    this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceUbicaciones = new MatTableDataSource(response.Data.docs);
        this.pageIndex=response.Data.docs.page;
      }
      this.isLoadingResults = false;
    });
  }


  filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceUbicaciones.filter = filtro.trim().toLowerCase();
  } 



/**
  guardarEdicionUbicacion() {

    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations/${this.UbicacionEditando._id}`;
    const payload = {
      descripcion: this.UbicacionEditando.descripcion,
      unidadMedida: this.UbicacionEditando.unidadMedida,
      documentoUbicacion: this.UbicacionEditando.documentoUbicacion,
      codigoUbicacion: this.UbicacionEditando.codigoUbicacion,
      estadoActivo: this.UbicacionEditando.estadoActivo,
    };

    console.log("el body es ", payload);

    this.http.patch(url, payload, httpOptions).subscribe(
      (response) => {
        console.log('Artículo editado exitosamente');
        this.mensajeExitoso = 'Operación exitosa: El artículo se ha actualizado correctamente.';
        setTimeout(() => {
          this.refreshPage();
        }, 3000);


        setTimeout(() => {
          this.mensajeExitoso = '';
        }, 5000);

      },
      (error) => {
        this.mensajeFallido = 'Error: El artículo no se ha podido actualizar ';
        console.error('Error al editar el artículo', error);
      }
    );
  }
 */

  refreshPage() {
    window.location.reload();
  }
  
}


export class Ubicacion {
  constructor(public codigo: string, public nombreZona: string, public numeroZona: String,
              public numeroEstanteria: string, public numeroUbicacion: string, public estadoActivo: boolean
              ){}
}
