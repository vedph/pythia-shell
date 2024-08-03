import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCountsComponent } from './token-counts.component';

describe('WordCountsComponent', () => {
  let component: TokenCountsComponent;
  let fixture: ComponentFixture<TokenCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
