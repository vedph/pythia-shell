import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEntrySetComponent } from './query-entry-set.component';

describe('QueryEntrySetComponent', () => {
  let component: QueryEntrySetComponent;
  let fixture: ComponentFixture<QueryEntrySetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryEntrySetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryEntrySetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
