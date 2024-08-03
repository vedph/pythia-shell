import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagedWordTreeFilterComponent } from './paged-word-tree-filter.component';

describe('PagedWordTreeFilterComponent', () => {
  let component: PagedWordTreeFilterComponent;
  let fixture: ComponentFixture<PagedWordTreeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagedWordTreeFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagedWordTreeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
