import { MockServicesModule } from '../app/services/services.mock.module';

export const environment = {
  production: false,
  apiRootUrl: 'http://localhost:5001',
  ServicesModule: MockServicesModule
};
