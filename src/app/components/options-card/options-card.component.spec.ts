import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsCardComponent } from './options-card.component';

describe('OptionsCardComponent', () => {
  let component: OptionsCardComponent;
  let fixture: ComponentFixture<OptionsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
