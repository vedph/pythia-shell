import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpusSetComponent } from './corpus-set.component';

describe('CorpusSetComponent', () => {
  let component: CorpusSetComponent;
  let fixture: ComponentFixture<CorpusSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorpusSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpusSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
