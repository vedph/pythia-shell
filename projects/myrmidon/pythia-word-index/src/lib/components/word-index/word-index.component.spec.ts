import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordIndexComponent } from './word-index.component';

describe('WordIndexComponent', () => {
  let component: WordIndexComponent;
  let fixture: ComponentFixture<WordIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
