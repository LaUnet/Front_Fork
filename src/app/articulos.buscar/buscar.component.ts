import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-buscarArticulo',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class buscarArticuloComponent {


  constructor(private router: Router, private http: HttpClient,  private tokenService: TokenService) { }


  columnas: string[] = ['codigo', 'codigoBarras', 'descripcion', 'marca', 'referencia', 'unidadMedida', 'codigoUbicacion', 'estadoActivo', 'accion'];

  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [8];
  isLoadingResults : boolean = true;



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
    this.isLoadingResults = true;
    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles', httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceArticulos = new MatTableDataSource(response.Data.docs);
        this.dataSourceArticulos.paginator = this.paginator;
        this.pageSize=response.Data.docs.limit;
        this.pageIndex=response.Data.docs.page;
        this.length = response.Data.totalDocs;
      }
      this.isLoadingResults = false; 
    });
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
    this.isLoadingResults = true;
    this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceArticulos = new MatTableDataSource(response.Data.docs);
        this.pageIndex=response.Data.docs.page;
      }
      this.isLoadingResults = false;
    });
  }


  filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceArticulos.filter = filtro.trim().toLowerCase();
  } 

    cargarUbicaciones() {
      const token = this.tokenService.token;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
        })
      };
  
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceUbicaciones = response.Data.docs;
          }
        });
    }


/**
  guardarEdicionArticulo() {

    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${this.articuloEditando._id}`;
    const payload = {
      descripcion: this.articuloEditando.descripcion,
      unidadMedida: this.articuloEditando.unidadMedida,
      documentoProveedor: this.articuloEditando.documentoProveedor,
      codigoUbicacion: this.articuloEditando.codigoUbicacion,
      estadoActivo: this.articuloEditando.estadoActivo,
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


export class Articulo {
  constructor(public codigo: string, public codigoBarras: string, public descripcion: String,
              public marca: string, public referencia: string, public unidadMedida: String,
              public codigoUbicacion: string, public estadoActivo: boolean
              ){}
}