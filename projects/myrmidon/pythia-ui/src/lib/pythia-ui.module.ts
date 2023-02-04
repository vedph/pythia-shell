import { NgModule } from '@angular/core';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';
import { PythiaApiModule } from '@myrmidon/pythia-api';
import { DisableControlDirective } from './directives/disable-control.directive';
import { EditablePipe } from './pipes/editable.pipe';

@NgModule({
  declarations: [DisableControlDirective, EditablePipe],
  imports: [NgToolsModule, CadmusRefsLookupModule, PythiaApiModule],
  exports: [DisableControlDirective, EditablePipe],
})
export class PythiaUiModule {}
