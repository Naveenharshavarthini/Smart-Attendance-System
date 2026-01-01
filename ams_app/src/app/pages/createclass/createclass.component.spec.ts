import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateclassComponent } from './createclass.component';

describe('CreateclassComponent', () => {
  let component: CreateclassComponent;
  let fixture: ComponentFixture<CreateclassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateclassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
