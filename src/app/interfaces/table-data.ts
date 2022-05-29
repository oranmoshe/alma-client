import {SyndicatorInterface} from './syndicator-interface';
import {PortfolioInterface} from './portfolio-interface';
export type tableItemType = SyndicatorInterface
  | PortfolioInterface;

export interface TableDataInterface<T extends tableItemType> {
  total: number;
  pageData: Array<T>;
}
