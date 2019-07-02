import { NgModule } from '@angular/core';

import { MockBackendService } from './backend/backend.mock.service';
import { BACKEND_SERVICE } from './backend/backend.model';
import { ProviderService } from './provider/provider.service';

@NgModule({
  providers: [{ provide: BACKEND_SERVICE, useClass: MockBackendService }, ProviderService]
})
export class MockServicesModule {}
