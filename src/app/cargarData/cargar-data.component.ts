import { Component } from '@angular/core';

@Component({
  selector: 'app-cargarData',
  templateUrl: './cargar-data.component.html',
  styleUrls: ['./cargar-data.component.css']
})
export class CargarDataComponent {

  fileOutput!: any;

  onChange(event: any) {
    var file = event.target.files?.[0] || null;
    var reader = new FileReader();
    reader.onload = (e: any) => {
      // The file's text will be printed here
      this.fileOutput = e.target.result;
    };

    reader.readAsText(file);
  }

}
