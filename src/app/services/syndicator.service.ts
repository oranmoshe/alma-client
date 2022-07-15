import { Injectable } from '@angular/core';
import {APIService} from './api-service.service';
import {Observable, forkJoin, of, BehaviorSubject} from 'rxjs';
import {PORTFOLIO_LIST, SYNDICATOR, PORTFOLIO_CREATE} from './api.endpoints.constants';
import { map } from 'rxjs/operators';
import {Syndicator} from '../classes/syndicator';
import {SyndicatorInterface} from '../interfaces/syndicator-interface';
import {PortfolioList} from '../classes/portfolio-list';
import {TableDataInterface} from '../interfaces/table-data';
import {PortfolioListInterface} from '../interfaces/portfolio-list-interface';
import { catchError } from 'rxjs/operators';
import {Portfolio} from '../classes/portfolio';
import {GlobalErrorHandler} from "./basic-error-handler";


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
    this.fetchAndSetCurrentSyndicator(this.syndicatorId);
  }

  handle(doNotify?: boolean, doThrow?: boolean, cb?: Function) {
    return catchError((err, caught) => caught);
  }

  public fetchAndSetCurrentSyndicator(syndicatorId: number) {
    this.getSyndicatorById(syndicatorId)
      .subscribe(syndicator => this.setCurrentSyndicator(syndicator));
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

}
