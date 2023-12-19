import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, public dialog: MatDialog) { }

  columnas: string[] = ['descripcion', 'referencia', 'marca', 'ubicacion', 'stock', 'precioventa', 'accion'];
  openedMenu!: boolean;
  openedArticle!: boolean;
  dataSourcecompras: any;
  ubicaciones: any[] = [];
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

  matcher = new MyErrorStateMatcher();
  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {

  }

  async buscarcompras() {
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
          this.dataSourcecompras = new MatTableDataSource(response.Data.docs);
          this.pageSize = response.Data.docs.limit;
          this.pageIndex = response.Data.docs.page;
          this.length = response.Data.totalDocs;
        }
        this.isLoadingResults = false;
      });
  }

  async recargarcompras(page: PageEvent) {
    this.dataSourcecompras = new MatTableDataSource;
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
          this.dataSourcecompras = new MatTableDataSource(response.Data.docs);
          this.pageIndex = response.Data.docs.page;
        }
        this.isLoadingResults = false;
      });
  }



  filtrar(event: Event) {
    this.buscarcompras();
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSourcecompras.filter = filtro.trim().toLowerCase();
    this.isLoadingResults = false;
  }

  refreshPage() {
    window.location.reload();
  }
}

export class compras {
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
