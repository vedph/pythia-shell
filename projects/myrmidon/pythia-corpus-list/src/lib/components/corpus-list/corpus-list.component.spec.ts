import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpusListComponent } from './corpus-list.component';

describe('CorpusListComponent', () => {
  let component: CorpusListComponent;
  let fixture: ComponentFixture<CorpusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorpusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
