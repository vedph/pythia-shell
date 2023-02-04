import { Pipe, PipeTransform } from '@angular/core';

import { HasUserId } from '@myrmidon/pythia-core';

import { EditableCheckService } from '../services/editable-check.service';

@Pipe({
  name: 'editable',
})
export class EditablePipe implements PipeTransform {
  constructor(private _editableService: EditableCheckService) {}

  transform(value: HasUserId): boolean {
    return this._editableService.isEditable(value);
  }
}
