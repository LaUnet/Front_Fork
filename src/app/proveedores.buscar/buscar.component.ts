import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-buscarProveedor',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class buscarProveedorComponent {


  constructor(private router: Router, private http: HttpClient,  private tokenService: TokenService, public dialog:MatDialog) { }


  columnas: string[] = ['nombreRazonSocial', 'tipoDocumento', 'numeroDocumento', 'telefono', 'direccion' , 'departamento' , 'municipio', 'email', 'regimenTributario', 'estadoActivo', 'accion'];

  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [10];
  isLoadingResults : boolean = true;
  opened: boolean = false;


  ubicaciones: any[] = [];
  dataSourceProveedores:any;


  ngOnInit() {
    this.buscarProveedor();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  async buscarProveedor() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers', httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceProveedores = new MatTableDataSource(response.Data.docs);
        this.dataSourceProveedores.paginator = this.paginator;
        this.pageSize=response.Data.docs.limit;
        this.pageIndex=response.Data.docs.page;
        this.length = response.Data.totalDocs;
      }
      this.isLoadingResults = false; 
    });
  }

  async recargarProveedor(page: PageEvent) {
    this.dataSourceProveedores = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceProveedores = new MatTableDataSource(response.Data.docs);
        this.pageIndex=response.Data.docs.page;
      }
      this.isLoadingResults = false;
    });
  }


  filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceProveedores.filter = filtro.trim().toLowerCase();
  } 

/**
  guardarEdicionProveedor() {

    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers/${this.ProveedorEditando._id}`;
    const payload = {
      descripcion: this.ProveedorEditando.descripcion,
      unidadMedida: this.ProveedorEditando.unidadMedida,
      documentoProveedor: this.ProveedorEditando.documentoProveedor,
      codigoUbicacion: this.ProveedorEditando.codigoUbicacion,
      estadoActivo: this.ProveedorEditando.estadoActivo,
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


export class Proveedor {
  constructor(public nombreRazonSocial: string, public tipoDocumento: string, public numeroDocumento: String,
              public telefono: string, public extension: string, public direccion: String, public departamento: String,
              public municipio: String, public email: String, public regimenTributario: String, public estado: boolean
              ){}
}
