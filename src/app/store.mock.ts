import { BehaviorSubject, Observable } from 'rxjs';

export class MockStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);
  private selector: any;

  setState(data: T) {
    this.state.next(data[this.selector]);
  }

  select(selector: any): Observable<T> {
    this.selector = selector;

    return this.state.asObservable();
  }

  dispatch(_action: any) {}
}
