import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { ArtifactActionTypes, ArtifactActions, ReceiveArtifact } from './actions';
import { BackendService, BACKEND_SERVICE } from 'src/app/services/backend/backend.model';

@Injectable()
export class ArtifactEffects {
  @Effect()
  $fetchReports: Observable<ArtifactActions> = this.actions$.pipe(
    ofType(ArtifactActionTypes.Fetch),
    // switchMap(() => this.backendService.getArtifacts().pipe(map(result => new ReceiveArtifact(result))))
    switchMap(() => of(new ReceiveArtifact()))
  );

  constructor(private actions$: Actions, @Inject(BACKEND_SERVICE) private backendService: BackendService) {}
}
