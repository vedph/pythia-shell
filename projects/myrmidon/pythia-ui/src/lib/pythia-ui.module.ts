import { NgModule } from '@angular/core';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';
import { PythiaApiModule } from '@myrmidon/pythia-api';
import { DisableControlDirective } from './directives/disable-control.directive';

@NgModule({
  declarations: [
    DisableControlDirective
  ],
  imports: [
    NgToolsModule,
    CadmusRefsLookupModule,
    PythiaApiModule,
  ],
  exports: [
    DisableControlDirective
  ],
})
export class PythiaUiModule {}
