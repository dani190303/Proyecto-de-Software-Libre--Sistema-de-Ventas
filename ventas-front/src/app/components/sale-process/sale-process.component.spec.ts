import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProcessComponent } from './sale-process.component';

describe('SaleProcessComponent', () => {
  let component: SaleProcessComponent;
  let fixture: ComponentFixture<SaleProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
