import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDistributionSetComponent } from './term-distribution-set.component';

describe('TermDistributionSetComponent', () => {
  let component: TermDistributionSetComponent;
  let fixture: ComponentFixture<TermDistributionSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermDistributionSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermDistributionSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
