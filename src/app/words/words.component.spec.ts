import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsComponent } from './words.component';

describe('WordsComponent', () => {
  let component: WordsComponent;
  let fixture: ComponentFixture<WordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
