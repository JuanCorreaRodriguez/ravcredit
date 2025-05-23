import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDynamicComponent } from './reference-dynamic.component';

describe('ReferenceDynamicComponent', () => {
  let component: ReferenceDynamicComponent;
  let fixture: ComponentFixture<ReferenceDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceDynamicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
