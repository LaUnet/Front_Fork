import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, public dialog: MatDialog) { }

  columnas: string[] = ['descripcion', 'referencia', 'marca', 'codigoUbicacion', 'stock', 'precioventa', 'accion'];
  openedMenu!: boolean;
  openedCustomer!: boolean;
  dataSourceCatalogo: any;
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
  matcher = new MyErrorStateMatcher();
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {

  }

  async buscarCatalogo() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`,
      })
    };
    this.isLoadingResults = true;
    this.http.get<any>('https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
          this.pageSize = response.Data.docs.limit;
          this.pageIndex = response.Data.docs.page;
          this.length = response.Data.totalDocs;
        }
        this.isLoadingResults = false;
      });
  }

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



  filtrar(event: Event) {
    this.buscarCatalogo();
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourceCatalogo.filter = filtro.trim().toLowerCase();
    this.isLoadingResults = false;
  }

  refreshPage() {
    window.location.reload();
  }
}

export class Catalogo {
  constructor(public descripcion: String, public marca: string, public referencia: string,
    public codigoUbicacion: string, public stock: string, public precioventa: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}
