import { MockServicesModule } from '../app/services/services.mock.module';

export const environment = {
  production: false,
  ServicesModule: MockServicesModule,
  segmentWriteKey: null,
  apiRootUrl: 'http://localhost:5001'
};
