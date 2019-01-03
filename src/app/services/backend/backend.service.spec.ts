import { TestBed } from '@angular/core/testing';

import { BackendService, BACKEND_SERVICE } from './backend.model';
import { MockServicesModule } from '../services.mock.module';

describe('BackendService', () => {
  let service: BackendService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockServicesModule]
    });

    service = TestBed.get(BACKEND_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
