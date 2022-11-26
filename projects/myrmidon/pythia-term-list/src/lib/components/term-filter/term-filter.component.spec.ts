import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermFilterComponent } from './term-filter.component';

describe('TermFilterComponent', () => {
  let component: TermFilterComponent;
  let fixture: ComponentFixture<TermFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
