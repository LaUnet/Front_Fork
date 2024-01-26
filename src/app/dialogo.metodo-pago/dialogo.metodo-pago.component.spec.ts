import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoMetodoPagoComponent } from './dialogo.metodo-pago.component';

describe('DialogoMetodoPagoComponent', () => {
  let component: DialogoMetodoPagoComponent;
  let fixture: ComponentFixture<DialogoMetodoPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogoMetodoPagoComponent]
    });
    fixture = TestBed.createComponent(DialogoMetodoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
