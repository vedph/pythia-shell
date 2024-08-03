import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCountsListComponent } from './token-counts-list.component';

describe('TokenCountsListComponent', () => {
  let component: TokenCountsListComponent;
  let fixture: ComponentFixture<TokenCountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenCountsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenCountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
