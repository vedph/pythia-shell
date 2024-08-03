import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagedWordTreeBrowserComponent } from './paged-word-tree-browser.component';

describe('PagedWordTreeBrowserComponent', () => {
  let component: PagedWordTreeBrowserComponent;
  let fixture: ComponentFixture<PagedWordTreeBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagedWordTreeBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagedWordTreeBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
