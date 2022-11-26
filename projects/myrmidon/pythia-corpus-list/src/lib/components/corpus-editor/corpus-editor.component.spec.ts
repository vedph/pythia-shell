import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpusEditorComponent } from './corpus-editor.component';

describe('CorpusEditorComponent', () => {
  let component: CorpusEditorComponent;
  let fixture: ComponentFixture<CorpusEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorpusEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
