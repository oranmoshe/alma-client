import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';

@Injectable()
export class GlobalErrorHandler {
  handleError(error) {
    if (error && error.status === 401) {
      alert('error');
    } else {
      alert('error2');
    }
  }
}
