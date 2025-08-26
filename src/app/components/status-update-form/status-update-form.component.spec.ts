import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUpdateFormComponent } from './status-update-form.component';

describe('StatusUpdateFormComponent', () => {
  let component: StatusUpdateFormComponent;
  let fixture: ComponentFixture<StatusUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
