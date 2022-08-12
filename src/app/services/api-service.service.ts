import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TableDataInterface, tableItemType} from '../interfaces/table-data';


const apiUrl = environment.apiUrl;

@Injectable()
export class APIService {
  constructor(private httpClient: HttpClient) {
  }

  fetch<T>(url: string, params = {}, cache?: boolean) {
    let headers;
    if (cache) {
      headers = new HttpHeaders().set('_Cache', 'true');
    }
    return this.httpClient.get<T>(apiUrl + url, { params: this.prepareEncodedParams(params), headers });
  }

  fetchPagination(url: string, pageSize: number, pageNumber: number,
                  additionalParams = {}, cache?: boolean):
                        Observable<TableDataInterface<tableItemType>> {
    const copyAdditionalParams = JSON.parse(JSON.stringify(additionalParams));
    const params = Object.assign(copyAdditionalParams, {size: pageSize.toString(), page: pageNumber.toString()});
    return this.fetch(url, params, cache) as Observable<TableDataInterface<tableItemType>>;
  }

  post(url, body = null, params = {}, headers = {}) {
    return this.httpClient.post(apiUrl + url, body , {headers, params: this.prepareEncodedParams(params)});
  }

  postFile(url, formData: FormData) {
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request<any>(req);
  }

  // use when response extended data is necessary:
  postExtended(url, body = null, params = {}, headers = {}) {
    return this.httpClient.post(apiUrl + url, body ,
      {headers, observe: 'response', params: this.prepareEncodedParams(params)});
  }


  put(url, body = null, params = {}) {
    return this.httpClient.put(apiUrl + url, body, { params: this.prepareEncodedParams(params) });
  }

  delete(url: string, params = {}) {
    return this.httpClient.delete(apiUrl + url, {params: this.prepareEncodedParams(params)});
  }

  private prepareEncodedParams(params = {}) {
    const result = {};

    if (!params) {
      return {};
    }

    for (const key of Object.keys(params)) {
      if (params[key]) {
        const stringParam = params[key].toString();
        result[key] =  stringParam.includes('+') ? encodeURIComponent(stringParam) : stringParam;
      }
    }

    return result;
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }

}
