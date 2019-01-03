import { Injectable } from '@angular/core';

import { BackendService, Character } from './backend.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockBackendService implements BackendService {
  getCharacter(id: number): Observable<Character> {
    return of({ id: 10, name: 'Jeno' });
  }
}
