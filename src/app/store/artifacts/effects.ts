import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { ArtifactActionTypes, ArtifactActions, ReceiveArtifact, FetchArtifact } from './actions';
import { BackendService, BACKEND_SERVICE } from 'src/app/services/backend/backend.model';

@Injectable()
export class ArtifactEffects {
  @Effect()
  $fetchReports: Observable<ArtifactActions> = this.actions$.pipe(
    ofType(ArtifactActionTypes.Fetch),
    switchMap((action: FetchArtifact) =>
      this.backendService
        .getArtifacts(action.payload.testReport, action.payload.testSuite)
        .pipe(map((result) => new ReceiveArtifact(result)))
    )
  );

  constructor(private actions$: Actions, @Inject(BACKEND_SERVICE) private backendService: BackendService) {}
}
