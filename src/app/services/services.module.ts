import { NgModule } from '@angular/core';

import { BACKEND_SERVICE } from './backend/backend.model';
import { RealBackendService } from './backend/backend.service';
import { ProviderService } from './backend/provider.service';

@NgModule({
  providers: [{ provide: BACKEND_SERVICE, useClass: RealBackendService }, ProviderService]
})
export class ServicesModule {}
