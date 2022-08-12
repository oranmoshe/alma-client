import { Injectable } from '@angular/core';
import {APIService} from './api-service.service';
import {Observable, forkJoin, of, BehaviorSubject} from 'rxjs';
import {
  PORTFOLIO_LIST,
  SYNDICATOR,
  PORTFOLIO_CREATE,
  PORTFOLIO_DELETE,
  PORTFOLIO,
  PORTFOLIO_UPDATE, PORTFOLIO_UPLOAD, PORTFOLIO_DOWNLOAD, PORTFOLIO_DELETE_ATTACHMENT
} from './api.endpoints.constants';
import { map } from 'rxjs/operators';
import {Syndicator} from '../classes/syndicator';
import {SyndicatorInterface} from '../interfaces/syndicator-interface';
import {PortfolioList} from '../classes/portfolio-list';
import {TableDataInterface} from '../interfaces/table-data';
import {PortfolioListInterface} from '../interfaces/portfolio-list-interface';
import { catchError } from 'rxjs/operators';
import {Portfolio} from '../classes/portfolio';
import {GlobalErrorHandler} from './basic-error-handler';


@Injectable()
export class SyndicatorService {
  handleError: Function;
  currentSyndicator: SyndicatorInterface;
  portfoliosList: PortfolioList[];
  syndicatorId: number;
  public syndicatorChangeNotification$ = new BehaviorSubject(null);
  public total: number;

  constructor(private apiService: APIService,
              private globalErrorHandler: GlobalErrorHandler) {
    this.handleError = this.globalErrorHandler.handleError;
    this.syndicatorId = 1;
    localStorage.setItem('syndicatorId', '1');
    this.fetchAndSetCurrentSyndicator(this.syndicatorId);
  }

  handle(doNotify?: boolean, doThrow?: boolean, cb?: Function) {
    return catchError((err, caught) => caught);
  }

  public getSyndicatorId() {
    return this.syndicatorId;
  }

  public fetchAndSetCurrentSyndicator(syndicatorId: number) {
    this.getSyndicatorById(syndicatorId).subscribe(syndicator => this.setCurrentSyndicator(syndicator));
  }

  public getCurrentSyndicator() {
    return this.currentSyndicator;
  }

  public setCurrentSyndicator(syndicator: SyndicatorInterface): void {
    if (syndicator && syndicator.id) {
      localStorage.setItem('syndicatorId', syndicator.id.toString());
    }
    this.currentSyndicator = new Syndicator(syndicator);
    this.syndicatorChangeNotification$.next(this.currentSyndicator);
  }

  public getSyndicatorById(syndicatorId: number, cacheable: boolean = true): Observable<Syndicator> {
    return this.apiService.fetch(SYNDICATOR.replace(':syndicatorId', syndicatorId.toString()), {}, cacheable)
      .pipe(map((syndicator: Syndicator) => {
            return new Syndicator(syndicator);
        },
      ));
  }

  public getCurrentPortfolioList(pageSize: number, page: number, searchQuery?: string) {
    return this.getPortfolioList(localStorage.getItem('syndicatorId'), pageSize, page, searchQuery);
  }

  public getPortfolioList(syndicatorId: string, pageSize: number, page: number, searchQuery?: string) {
    const params = searchQuery ? {search: searchQuery} : {};
    return this.apiService.fetchPagination(PORTFOLIO_LIST.replace(':syndicatorId', syndicatorId),
      pageSize, page, params, false)
      .pipe(map((res: TableDataInterface<PortfolioListInterface>) => {
        this.total = res.total;
        this.portfoliosList = res.pageData && res.pageData.length ?
          res.pageData.map(portfolioList => {
            if (portfolioList['deactivation']) {
              portfolioList['deactivation'] = portfolioList['deactivation'].substring(0, 10);
            }
            return new PortfolioList(portfolioList);
          }) : [];
        localStorage.setItem('hasSyndicators', String(this.total || 0));
      }));
  }

  public createPortfolio(syndicatorId: number, newPortfolio: Portfolio): Observable<Syndicator> {
    return this.apiService.post(PORTFOLIO_CREATE.replace(':syndicatorId', syndicatorId.toString()), newPortfolio)
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }

  deletePortfolio(syndicatorId: number, portfolioId: number) {
    return this.apiService.delete(PORTFOLIO_DELETE.replace(':syndicatorId', syndicatorId.toString())
      .replace(':portfolioId', portfolioId.toString()))
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }

  getPortfolio(syndicatorId: number, portfolioId: number) {
    return this.apiService.fetch(PORTFOLIO.replace(':syndicatorId', syndicatorId.toString())
      .replace(':portfolioId', portfolioId.toString()))
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }

  updatePortfolio(syndicatorId: number, formData: FormData) {
    return this.apiService.put(PORTFOLIO_UPDATE.replace(':syndicatorId', syndicatorId.toString()), formData)
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }

  uploadFile(syndicatorId: Number, portfolioId: Number, files: File[]) {
    const uploadData = new FormData(); // Create Form Data object to upload the file in POST FORM
    for (let i in files) {
      if (files[i] != null) {
        uploadData.append('files', files[i]);
      }
    }
    return this.apiService.postFile(PORTFOLIO_UPLOAD.replace(':syndicatorId', syndicatorId.toString())
      .replace(':portfolioId', portfolioId.toString()), uploadData)
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }

  downloadFile(syndicatorId: Number, portfolioId: Number,  attachmentId: Number) {
    return this.apiService.getImage(PORTFOLIO_DOWNLOAD.replace(':syndicatorId', syndicatorId.toString())
        .replace(':portfolioId', portfolioId.toString())
        .replace(':attachmentId', attachmentId.toString()))
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }


  removeFile(syndicatorId: number, portfolioId: Number,  attachmentId: Number) {
    return this.apiService.delete(PORTFOLIO_DELETE_ATTACHMENT.replace(':syndicatorId', syndicatorId.toString())
      .replace(':portfolioId', portfolioId.toString())
      .replace(':attachmentId', attachmentId.toString()))
      .pipe(map((result) => {
        return result;
      }))
      .pipe(this.handleError());
  }
}
