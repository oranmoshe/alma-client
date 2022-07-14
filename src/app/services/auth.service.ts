import { Injectable } from '@angular/core';
import {APIService} from './api-service.service';
import {Observable} from 'rxjs';
import {CURRENT_USER} from './api.endpoints.constants';
import {GlobalErrorHandler} from './basic-error-handler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private handleError: Function;
  public shouldCheckExpiration = false;

  constructor(private apiService: APIService, private basicErrorHandler: GlobalErrorHandler) {
    this.handleError = this.basicErrorHandler.handleError;
  }

  public checkSession(): Observable<any> {
    return this.apiService.fetch(CURRENT_USER)
      .pipe(this.handleError());
  }
  public setShouldCheckSession(value: boolean) {
    this.shouldCheckExpiration = value;
  }
}
