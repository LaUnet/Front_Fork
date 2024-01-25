
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { LocalStorageService } from '../local-storage.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-dialogo.carItem',
  templateUrl: './dialogo.carItem.component.html',
  styleUrls: ['./dialogo.carItem.component.css']
})
export class DialogoCarItemComponent implements OnInit {


  matcher = new MyErrorStateMatcher();
  /**
   * Control Error Textfields carItem
   */
  descripcionFormControl = new FormControl('');
  cantidadFormControl = new FormControl('');
  precioFormControl = new FormControl('');
  impuestoFormControl = new FormControl('');
  descuentoFormControl = new FormControl('');
  totalFormControl = new FormControl('');

  articuloCarItem = {
    descripcion: '',
    cantidad: '',
    precio: '',
    impuesto: '',
    descuento: '',
    total: '',
  };

  constructor(
    public dialogo: MatDialogRef<DialogoCarItemComponent>,
    @Inject(MAT_DIALOG_DATA) public element: any = [], @Inject(MAT_DIALOG_DATA) public index: number,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService, public utilsService: UtilsService) { }

  confirmar(): void {
    this.dialogo.close();
  }

  cerrar(): void {
    this.dialogo.close();
  }

  changeCarItem(valor:any, campo:any){
    console.log(valor, campo)

  }


  ngOnInit() {
  }
}
export class Articulo {
  constructor(public codigo: string, public codigoBarras: string, public descripcion: String, public marca: string, public referencia: string,
    public unidadMedida: String, public codigoUbicacion: string, public estadoActivo: boolean, public precioVenta: string,
    public ivaCompra: String, public subtotalCompra: string, public totalCompra: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}