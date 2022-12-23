import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDistributionComponent } from './term-distribution.component';

describe('TermDistributionComponent', () => {
  let component: TermDistributionComponent;
  let fixture: ComponentFixture<TermDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
