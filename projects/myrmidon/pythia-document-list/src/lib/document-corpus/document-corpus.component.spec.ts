import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCorpusComponent } from './document-corpus.component';

describe('DocumentCorpusComponent', () => {
  let component: DocumentCorpusComponent;
  let fixture: ComponentFixture<DocumentCorpusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCorpusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCorpusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
