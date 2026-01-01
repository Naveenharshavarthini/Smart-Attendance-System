import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacesregComponent } from './facesreg.component';

describe('FacesregComponent', () => {
  let component: FacesregComponent;
  let fixture: ComponentFixture<FacesregComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacesregComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacesregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
