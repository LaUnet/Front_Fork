
import { Component,Inject, OnInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from '../utils.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { TokenService } from '../login/token';

@Component({
  selector: 'app-dialogo.invoice',
  templateUrl: './dialogo.invoice.component.html',
  styleUrls: ['./dialogo.invoice.component.css']
})
export class DialogoInvoiceComponent implements OnInit{

  constructor(public dialogo: MatDialogRef<DialogoInvoiceComponent>, @Inject(MAT_DIALOG_DATA) public dataSourceSales: any = [],
    private http: HttpClient, private tokenService: TokenService, public utilsService: UtilsService )
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
