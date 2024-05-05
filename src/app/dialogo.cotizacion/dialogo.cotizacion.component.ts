
import { Component,Inject, OnInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from '../utils.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { TokenService } from '../login/token';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dialogo.cotizacion',
  templateUrl: './dialogo.cotizacion.component.html',
  styleUrls: ['./dialogo.cotizacion.component.css']
})
export class DialogoCotizacionComponent implements OnInit{

  constructor(public dialogo: MatDialogRef<DialogoCotizacionComponent>, @Inject(MAT_DIALOG_DATA) public dataSourceSales: any = [],
    private http: HttpClient, private tokenService: TokenService, public utilsService: UtilsService, private currencyPipe: CurrencyPipe )
    {
      dialogo.disableClose = true
    }


  ngOnInit(): void {
  }

  print() {
    window.focus();
    window.print();
  }

  cerrar() {
    this.dialogo.close(true);
  }
}