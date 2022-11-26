import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporaComponent } from './corpora.component';

describe('CorporaComponent', () => {
  let component: CorporaComponent;
  let fixture: ComponentFixture<CorporaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
