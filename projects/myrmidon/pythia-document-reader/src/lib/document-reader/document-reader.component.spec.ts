import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReaderComponent } from './document-reader.component';

describe('DocumentReaderComponent', () => {
  let component: DocumentReaderComponent;
  let fixture: ComponentFixture<DocumentReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentReaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
