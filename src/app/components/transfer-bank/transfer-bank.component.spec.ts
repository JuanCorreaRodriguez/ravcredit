import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBankComponent } from './transfer-bank.component';

describe('TransferBankComponent', () => {
  let component: TransferBankComponent;
  let fixture: ComponentFixture<TransferBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferBankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
