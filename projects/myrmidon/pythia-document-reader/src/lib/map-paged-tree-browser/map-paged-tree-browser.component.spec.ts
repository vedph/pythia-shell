import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPagedTreeBrowserComponent } from './map-paged-tree-browser.component';

describe('MapPagedTreeBrowserComponent', () => {
  let component: MapPagedTreeBrowserComponent;
  let fixture: ComponentFixture<MapPagedTreeBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPagedTreeBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPagedTreeBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
