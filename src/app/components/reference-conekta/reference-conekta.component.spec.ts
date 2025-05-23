import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceConektaComponent } from './reference-conekta.component';

describe('ReferenceConektaComponent', () => {
  let component: ReferenceConektaComponent;
  let fixture: ComponentFixture<ReferenceConektaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceConektaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceConektaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
