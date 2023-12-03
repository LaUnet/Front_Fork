import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  
constructor(private router: Router, private http: HttpClient,  private tokenService: TokenService, public dialog:MatDialog) { }  

columnas: string[] = ['codigo', 'codigoBarras', 'descripcion', 'marca', 'referencia', 'unidadMedida', 'codigoUbicacion', 'stock', 'precioventa', 'accion'];
quantityCart:number = 8;
opened!:boolean;
dataSourceCatalogo:any;
isLoadingResults : boolean = false;
pageEvent!: PageEvent;
pageIndex:number = 0;
pageSize !:number;
length!:number;
pageSizeOptions = [20];


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
  this.http.get<any>('https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle', httpOptions )
  .subscribe(response => {
    if (response.Status) {
      this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
      this.pageSize=response.Data.docs.limit;
      this.pageIndex=response.Data.docs.page;
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
  this.http.get<any>(`https://p01--node-launet2--m5lw8pzgzy2k.code.run/api/detailArticle?page=${this.paginator.pageIndex + 1}&limit=${this.paginator.pageSize}`, httpOptions )
  .subscribe(response => {
    if (response.Status) {
      this.dataSourceCatalogo = new MatTableDataSource(response.Data.docs);
      this.pageIndex=response.Data.docs.page;
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

  showCart() {
      console.log("Paila");
    };
  }

  export class Catalogo {
    constructor(public codigo: string, public codigoBarras: string, public descripcion: String,
                public marca: string, public referencia: string, public unidadMedida: String,
                public codigoUbicacion: string, public stock: string, public precioventa: string
                ){}
  }
