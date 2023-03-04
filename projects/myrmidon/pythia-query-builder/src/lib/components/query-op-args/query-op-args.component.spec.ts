import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryOpArgsComponent } from './query-op-args.component';

describe('QueryOpArgsComponent', () => {
  let component: QueryOpArgsComponent;
  let fixture: ComponentFixture<QueryOpArgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryOpArgsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryOpArgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
