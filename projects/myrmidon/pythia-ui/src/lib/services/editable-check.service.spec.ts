import { TestBed } from '@angular/core/testing';

import { EditableCheckService } from './editable-check.service';

describe('EditableCheckService', () => {
  let service: EditableCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditableCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
