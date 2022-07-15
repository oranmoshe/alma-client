import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import { of, throwError as observableThrowError } from 'rxjs';

@Injectable()
export class GlobalErrorHandler {
  handleError() {
    return catchError((err: any) => {
      console.log(err);
      return of(err);
    });
  }
}
