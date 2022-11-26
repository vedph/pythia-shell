import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpusFilterComponent } from './corpus-filter.component';

describe('CorpusFilterComponent', () => {
  let component: CorpusFilterComponent;
  let fixture: ComponentFixture<CorpusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorpusFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
