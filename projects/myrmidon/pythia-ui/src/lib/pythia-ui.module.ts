import { NgModule } from '@angular/core';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';
import { PythiaApiModule } from '@myrmidon/pythia-api';

@NgModule({
  declarations: [],
  imports: [
    NgToolsModule,
    CadmusRefsLookupModule,
    PythiaApiModule,
  ],
  exports: [],
})
export class PythiaUiModule {}
