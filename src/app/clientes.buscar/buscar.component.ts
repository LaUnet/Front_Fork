import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-buscarCliente',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class buscarClienteComponent {


  constructor(private router: Router, private http: HttpClient,  private tokenService: TokenService) { }


  columnas: string[] = ['nombreRazonSocial', 'tipoDocumento', 'numeroDocumento', 'telefono','email', 'estadoActivo', 'accion'];

  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [8];
  isLoadingResults : boolean = true;



  ubicaciones: any[] = [];
  dataSourceClientes:any;


  ngOnInit() {
    this.buscarCliente();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  async buscarCliente() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers', httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceClientes = new MatTableDataSource(response.Data.docs);
        this.dataSourceClientes.paginator = this.paginator;
        this.pageSize=response.Data.docs.limit;
        this.pageIndex=response.Data.docs.page;
        this.length = response.Data.totalDocs;
      }
      this.isLoadingResults = false; 
    });
  }

  async recargarCliente(page: PageEvent) {
    this.dataSourceClientes = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceClientes = new MatTableDataSource(response.Data.docs);
        this.pageIndex=response.Data.docs.page;
      }
      this.isLoadingResults = false;
    });
  }


  filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceClientes.filter = filtro.trim().toLowerCase();
  } 


/**
  guardarEdicionCliente() {

    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers/${this.ClienteEditando._id}`;
    const payload = {
      descripcion: this.ClienteEditando.descripcion,
      unidadMedida: this.ClienteEditando.unidadMedida,
      documentoProveedor: this.ClienteEditando.documentoProveedor,
      codigoUbicacion: this.ClienteEditando.codigoUbicacion,
      estadoActivo: this.ClienteEditando.estadoActivo,
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


export class Cliente {
  constructor(public nombreRazonSocial: string, public tipoDocumento: string, public numeroDocumento: String,
              public telefono: string, public extension: string, public email: string, 
              public direccionEntrega:[] , public direccionFacturacion:[],
              public estadoActivo: boolean
              ){}
}