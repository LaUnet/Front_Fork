import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {buscarUsuarioComponent, Usuario} from './buscar.component'

@Component({
  selector: 'app-editarUsuario',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit{

  constructor(
    private buscarUsuario: buscarUsuarioComponent,
    public dialogRef:MatDialogRef<EditarComponent>,
    @Inject(MAT_DIALOG_DATA) data:any
    ) {}


  ngOnInit(): void {

      }

  onClickNO(): void {
    this.dialogRef.close();
  }

}
