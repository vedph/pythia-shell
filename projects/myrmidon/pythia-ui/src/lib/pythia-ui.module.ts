import { NgModule } from '@angular/core';

import { PythiaApiModule } from '@myrmidon/pythia-api';

import { DisableControlDirective } from './directives/disable-control.directive';
import { EditablePipe } from './pipes/editable.pipe';

@NgModule({
  declarations: [DisableControlDirective, EditablePipe],
  imports: [PythiaApiModule],
  exports: [DisableControlDirective, EditablePipe],
})
export class PythiaUiModule {}
