import {Component, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-buscarUsuario',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class buscarUsuarioComponent {

  constructor(private router: Router, private http: HttpClient,  private tokenService: TokenService) { }


  columnas: string[] = ['_id', 'username', 'email', 'roles' , 'accion'];

  pageEvent!: PageEvent;
  pageIndex:number = 0;
  pageSize !:number;
  length!:number;
  pageSizeOptions = [10];
  isLoadingResults : boolean = false;
  dataSourceUsuarios:any;
  opened: boolean = false;

  ngOnInit() {
    this.buscarUsuario();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  async buscarUsuario() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users', httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceUsuarios = new MatTableDataSource(response.Data.docs);
        this.dataSourceUsuarios.paginator = this.paginator;
        this.pageSize=response.Data.docs.limit;
        this.pageIndex=response.Data.docs.page;
        this.length = response.Data.totalDocs;
      }
      this.isLoadingResults = false; 
    });
  }

  async recargarUsuario(page: PageEvent) {
    this.dataSourceUsuarios = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
    .subscribe(response => {
      if (response.Status) {
        this.dataSourceUsuarios = new MatTableDataSource(response.Data.docs);
        this.pageIndex=response.Data.docs.page;
      }
      this.isLoadingResults = false;
    });
  }


  filtrar(event: Event) {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSourceUsuarios.filter = filtro.trim().toLowerCase();
  } 

/**

  guardarEdicionUsuario() {

    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users/${this.UsuarioEditando._id}`;
    const payload = {
      descripcion: this.UsuarioEditando.descripcion,
      unidadMedida: this.UsuarioEditando.unidadMedida,
      documentoUsuario: this.UsuarioEditando.documentoUsuario,
      codigoUsuario: this.UsuarioEditando.codigoUsuario,
      estadoActivo: this.UsuarioEditando.estadoActivo,
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


export class Usuario {
  constructor(public id: string, public username: string, public email: String,
              public password: string, public roles: string
              ){}
}
