import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams} from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DialogoConfirmacionComponent } from "../dialogo.confirmacion/dialogo.component";
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {

  constructor(private router: Router,private http: HttpClient, private tokenService: TokenService, public dialogo: MatDialog) { }

  columnas: string[] = ['descripcion', 'referencia', 'marca', 'ubicacion', 'stock', 'precioventa', 'accion'];
  openedMenu!: boolean;
  openedCustomer!: boolean;
  dataSourceCatalogo: any;
  dataSourceClientes: any;
  isLoadingResults: boolean = false;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize !: number;
  length!: number;
  pageSizeOptions = [20];
  searchDescription!: boolean;
  searchCode!: boolean;
  


  /**
   * Control Error Textfields Articles
   */
  codigoBarrasFormControl = new FormControl('', [Validators.required]);
  descripcionFormControl = new FormControl('', [Validators.required]);
  marcaFormControl = new FormControl('', [Validators.required]);
  referenciaFormControl = new FormControl('', [Validators.required]);
  unidadMedidaFormControl = new FormControl('', [Validators.required]);
  codigoUbicacionFormControl = new FormControl('', [Validators.required]);
  nuevoArticulo = {
    codigoBarras: '',
    descripcion: '',
    unidadMedida: '',
    codigoUbicacion: '',
    marca:'',
    referencia: ''
  };

  /**
 * Control Error Textfields Customers
 */
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  tipoDocumentoFormControl = new FormControl('', [Validators.required]);
  numeroDocumentoFormControl = new FormControl('', [Validators.required]);
  nombreRazonSocialFormControl = new FormControl('', [Validators.required]);
  telefonoFormControl = new FormControl('', [Validators.required]);
  direccionFormControl = new FormControl('', [Validators.required]);
  departamentoFormControl = new FormControl('', [Validators.required]);
  municipioFormControl = new FormControl('', [Validators.required]);
  barrioFormControl = new FormControl('', [Validators.required]);
  tipoClienteFormControl = new FormControl('', [Validators.required]);

  nuevoCliente: any = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombreRazonSocial: '',
    telefono: '',
    extension: "",
    direccion: '',
    departamento: '',
    municipio: '',
    email: '',
    tipoCliente: '',
    barrio:''
  };

    /**
 * Control Error Textfields Consultas
 */
      
    buscarDescripcionFormControl = new FormControl('', [Validators.required]);
    buscarCodigoBarrasFormControl = new FormControl('', [Validators.required]);
  
    nuevaBusqueda: any = {
      buscarDescripcion: '',
      buscarCodigoBarras: '',
    };

  matcher = new MyErrorStateMatcher();
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  @ViewChild(MatSort, {static: true}) sort!: MatSort;  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.cargarClientes();
  }

  async cargarClientes() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    try {
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/customers', httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceClientes = response.Data.docs;
            this.dataSourceClientes.sort = this.sort;
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

  async buscarCatalogo(tipo:number) {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };

    let httpParams = new HttpParams();
    if (tipo === 1){
      httpParams = httpParams.append('descripcion', this.nuevaBusqueda.buscarDescripcion);
    }
    if (tipo === 2){
      httpParams = httpParams.append('codigoBarras', this.nuevaBusqueda.buscarCodigoBarras);
    }
    
    this.isLoadingResults = true;
    this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle?${httpParams}`,httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
          /**
          this.pageSize = response.Data.docs.limit;
          this.pageIndex = response.Data.docs.page;
          this.length = response.Data.totalDocs;
           */
          console.log(httpParams, httpOptions)
          console.log(response)
        }
        this.isLoadingResults = false;
      });
  }

/**
  async recargarCatalogo(page: PageEvent) {
    this.dataSourceCatalogo = new MatTableDataSource;
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
          this.pageIndex = response.Data.docs.page;
        }
        this.isLoadingResults = false;
      });
  }
 */

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceCatalogo.filter = filtro.trim().toLowerCase();
    this.isLoadingResults = false;
  }

  filtrarCliente(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceClientes.filter = filtro.trim().toLowerCase();
} 

  mostrarDialogo(message:string, process:number): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: message
      })
      .afterClosed()
      .subscribe((confirmar: Boolean) => {
        if (confirmar) {
          if (process === 1) {
          this.routerLinkArticulo();
          }
          if (process === 2) {
            this.refreshPage();
            }
        } else {
          //alert("No hacer nada");
        }
      });
  }

  routerLinkArticulo():void{
    this.router.navigate(['/registrarArticulo'])
  };

  refreshPage() {
    window.location.reload();
  }
}

export class Catalogo {
  constructor(public descripcion: String, public marca: string, public referencia: string,
    public ubicacion: string, public stock: string, public precioventa: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
