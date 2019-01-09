import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BackendService, Character } from './backend.model';
import { Observable } from 'rxjs';

@Injectable()
export class RealBackendService implements BackendService {
  constructor(private httpClient: HttpClient) {}

  getCharacter(id: number): Observable<Character> {
    return this.httpClient.get(`https://rickandmortyapi.com/api/character/${id}`) as Observable<Character>;
  }
}
