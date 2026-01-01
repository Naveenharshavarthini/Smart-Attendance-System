import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetablelistComponent } from './timetablelist.component';

describe('TimetablelistComponent', () => {
  let component: TimetablelistComponent;
  let fixture: ComponentFixture<TimetablelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetablelistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimetablelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
