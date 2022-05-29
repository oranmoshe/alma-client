import { Injectable } from '@angular/core';
import {APIService} from './api-service.service';
import {Observable, forkJoin, of} from 'rxjs';
import {PORTFOLIO_LIST, SYNDICATOR} from './api.endpoints.constants';
import { map } from 'rxjs/operators';
import {Syndicator} from '../classes/syndicator';
import {SyndicatorInterface} from '../interfaces/syndicator-interface';
import {PortfolioList} from '../classes/portfolio-list';
import {TableDataInterface} from '../interfaces/table-data';
import {PortfolioListInterface} from '../interfaces/portfolio-list-interface';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SyndicatorService {
  handleError: Function;
  currentSyndicator: SyndicatorInterface;
  portfoliosList: PortfolioList[];
  public total: number;

  constructor(private apiService: APIService) {
    this.handleError = function (e) {
      return e;
    };
  }

  handle(doNotify?: boolean, doThrow?: boolean, cb?: Function) {
    return catchError((err, caught) => caught);
  }

  public getCurrentSyndicator(syndicatorId: number, cacheable: boolean = true,
                               returnSyndicator?: boolean): Observable<any> {
    const calls = [];
    calls.push(this.getSyndicatorById(syndicatorId, cacheable, returnSyndicator));
    // if (!localStorage['hasCurrentCustomerSites']) {
    //   calls.push(this.getCustomerSitesCount(syndicatorId));
    // }

    return forkJoin(calls);
  }

  public getSyndicatorById(syndicatorId: number, cacheable: boolean = true,
                            returnSyndicator?: boolean): Observable<Syndicator> {
    return this.apiService.fetch(SYNDICATOR.replace(':syndicatorId', syndicatorId.toString()), {}, cacheable)
      .pipe(map((syndicator: Syndicator) => {
          if (!returnSyndicator) {
            this.currentSyndicator = new Syndicator(syndicator);
          } else {
            return new Syndicator(syndicator);
          }
        },
      ))
      .pipe(this.handleError(true));
  }

  public getPortfolioList(pageSize: number, page: number, searchQuery?: string) {
    const params = searchQuery ? {search: searchQuery} : {};
    return this.apiService.fetchPagination(PORTFOLIO_LIST.replace(':syndicatorId', '1'), pageSize, page, params, false)
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

}
