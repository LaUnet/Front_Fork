import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Papeleria PuntoU';
  negocio: string = 'venta de materiales para cosas didacticas';
  hidden = false;
  toggleBadgeVisibility() {this.hidden = !this.hidden;}
}
