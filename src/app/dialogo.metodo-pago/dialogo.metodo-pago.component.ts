
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormControl, FormGroupDirective, NgForm,} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { LocalStorageService } from '../local-storage.service';
import { UtilsService } from '../utils.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';

@Component({
  selector: 'app-dialogo.metodo-pago',
  templateUrl: './dialogo.metodo-pago.component.html',
  styleUrls: ['./dialogo.metodo-pago.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class DialogoMetodoPagoComponent {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    tipoPagoFormControl: ['', Validators.required],
    efectivoFormControl: ['', Validators.required],
    transferenciaFormControl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
    facturaElectronicaFormControl: ['', Validators.required],
    vendedorFormControl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private tokenService: TokenService) {}

  dataSourceUsuarios: any = [];
  matcher = new MyErrorStateMatcher();
  isLoadingResults: boolean = false;
  mensajeFallido: string = '';
  pasarela = {
    tipoPago: '',
    efectivo: '',
    transferencia: '',
    facturaElectronica: false,
    vendedor:'',
  };

  
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    this.isLoadingResults= true;
    try {
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.dataSourceUsuarios = response.Data;
        }
        this.isLoadingResults= false;
      }, error => {
        this.isLoadingResults= false;
        this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
        console.error('Error en la solicitud:', error);
      }); 
    } catch (error) {
      this.isLoadingResults= false;
      this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }


}

  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }