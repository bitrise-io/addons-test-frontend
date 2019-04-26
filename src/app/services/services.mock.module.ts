import { NgModule } from '@angular/core';

import { MockBackendService } from './backend/backend.mock.service';
import { BACKEND_SERVICE } from './backend/backend.model';

@NgModule({
  providers: [
    { provide: BACKEND_SERVICE, useClass: MockBackendService }
  ]
})
export class MockServicesModule {}
