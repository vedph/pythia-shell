import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PythiaStatsComponent } from './pythia-stats.component';

describe('PythiaStatsComponent', () => {
  let component: PythiaStatsComponent;
  let fixture: ComponentFixture<PythiaStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PythiaStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PythiaStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
