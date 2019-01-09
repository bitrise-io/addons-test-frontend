import { Observable } from 'rxjs';

export interface Character {
  id: number;
  name: string;
}

export const BACKEND_SERVICE = 'BACKEND_SERVICE';

export interface BackendService {
  getCharacter(id: number): Observable<Character>;
}
