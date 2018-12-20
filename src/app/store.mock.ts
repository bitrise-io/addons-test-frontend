import { BehaviorSubject } from 'rxjs';

export class MockStore<T> {
  state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  dispatch() {}

  pipe(operatorFunction: any) {
    return operatorFunction(this.state);
  }
}
