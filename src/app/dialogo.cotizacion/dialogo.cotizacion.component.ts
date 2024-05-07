import { Component,Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('card', { static: true }) card: ElementRef | undefined;  
  @ViewChild('cardheader', { static: true }) cardheader: ElementRef | undefined;  
  @ViewChild('cardbody',   { static: true }) cardbody: ElementRef | undefined;  

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
    /**
    let printContents, printCard, printCardheader, printCardbody, popupWin;
    printCard = document.getElementById("card")?.innerHTML.toString();
    printCardheader = document.getElementById("cardheader")?.innerHTML.toString();
    printCardbody = document.getElementById("cardbody")?.innerHTML.toString();
    printContents = (<string>printCard + "", <string>printCardheader + "", <string>printCardheader + "").replace("col-sm", "col-xs");
    // console.log(printContents);
    document.open();
    document.write(`
      <html>
        <head>
        ${printCard},
        ${printCardheader}
        </head>
        <body onload="window.print();">
          ${printCardbody}
        </body>
      </html>`);
    window.close();
    document.close();
    */
  }

  cerrar() {
    this.dialogo.close(true);
  }

  continuar() {
    this.dialogo.close(false);
  }
}