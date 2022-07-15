import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
  NbDialogService,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbWindowService,
} from '@nebular/theme';
import {Subscription} from 'rxjs';
import {SyndicatorService} from '../../../services/syndicator.service';
import {PortfolioList} from '../../../classes/portfolio-list';
import {WindowFormPortfolioComponent} from './window-form-add-portfolio/window-form-portfolio.component';
import EventEmitter from 'events';
import {GlobalErrorHandler} from '../../../services/basic-error-handler';
import {Portfolio} from '../../../classes/portfolio';
import {DialogNamePromptComponent} from "../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component";
import {DialogAgreementPromptComponent} from "../../modal-overlays/dialog/dialog-agreement/dialog-agreement.component";


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  offeringName: string;
  customerName: string;
  amount: string;
  creationDate: string;
  priority: string;
  status: string;
}

@Component({
  selector: 'ngx-portfolio-management',
  templateUrl: './portfolio-management.component.html',
  styleUrls: ['./portfolio-management.component.scss'],
})
export class PortfolioManagementComponent implements OnInit, OnDestroy {

  @Output() createWindowChange = new EventEmitter();
  customColumn = 'name';
  defaultColumns = [ 'offeringName', 'customerName', 'amount', 'creationDate', 'priority', 'status' ];
  defaultColumns2 = [ 'actions' ];
  allColumns = [ this.customColumn, ...this.defaultColumns, ...this.defaultColumns2 ];
  allColumnsHeaders = {'name': 'Name', 'offeringName': 'Offering Name', 'customerName': 'Customer Name',
    'amount': 'Amount', 'creationDate': 'Creation Date', 'priority': 'Priority', 'status': 'Status',
    'actions': ''};

  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  isPending: boolean;
  public pageIndex: number = 0;
  public pageSize: number = 10;
  private searchSubscription: Subscription;
  public showType: string = 'list';
  private syndicatorId: number = 1;
  private handleError: Function;

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private syndicatorService: SyndicatorService,
              private windowService: NbWindowService,
              private globalErrorHandler: GlobalErrorHandler,
              private dialogService: NbDialogService) {
    this.handleError = this.globalErrorHandler.handleError;
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.isPending = true;
    this.searchSubscription = this.syndicatorService.getCurrentPortfolioList(this.pageSize, this.pageIndex, null)
      .subscribe(() => {
        this.isPending = false;
        // if (portfoliosList && portfoliosList.length > 0)
        //   portfoliosList = portfoliosList.filter(portfolio => portfolio.activated);
        this.initializeDataSource();
      });
  }

  getHeader(columnName: string): string {
    if (this.allColumnsHeaders[columnName])
      return this.allColumnsHeaders[columnName];
    return '';
  }

  getPortfolioList(): PortfolioList[] {
    return this.syndicatorService.portfoliosList;
  }

  private initializeDataSource(): void {
    const ssss: TreeNode<FSEntry>[] =  this.getPortfolioList().map(s => (
      {
        data: {id: s.id, name: s.name, offeringName: s.offeringName, customerName: s.customerName, amount: s.amount,
          creationDate: s.creationDate, priority: s.priority, status: s.status},
        children: [

        ],
      }
    )); // no error
    this.dataSource = this.dataSourceBuilder.create(ssss);
    const awww = { column: 'id', direction: 'desc' } as NbSortRequest;
    this.dataSource.sort(awww);
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  changeShowType(showType: string) {
    this.showType = showType;
  }

  openPortfolioWindow(id): void {
    if (id)
      this.syndicatorService.getPortfolio(this.syndicatorId, id).subscribe((portfolio: Portfolio) =>
        this.openPortfolioWindowWithPortfolio(portfolio));
    else
      this.openPortfolioWindowWithPortfolio(null);

  }
  openPortfolioWindowWithPortfolio(portfolio: Portfolio) {
    const windowRef = this.windowService.open(WindowFormPortfolioComponent, { title: `Window`, context: portfolio });
    windowRef.onClose.subscribe(() => this.refreshData());
  }

  // private data: TreeNode<FSEntry>[] = [
  //   {
  //     data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
  //     children: [
  //       { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
  //       { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } },
  //       { data: { name: 'project-3', kind: 'txt', size: '466 KB' } },
  //       { data: { name: 'project-4.docx', kind: 'docx', size: '900 KB' } },
  //     ],
  //   },
  //   {
  //     data: { name: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
  //     children: [
  //       { data: { name: 'Report 1', kind: 'doc', size: '100 KB' } },
  //       { data: { name: 'Report 2', kind: 'doc', size: '300 KB' } },
  //     ],
  //   },
  //   {
  //     data: { name: 'Other', kind: 'dir', size: '109 MB', items: 2 },
  //     children: [
  //       { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
  //       { data: { name: 'secret-note.txt', kind: 'txt', size: '2 MB' } },
  //     ],
  //   },
  // ];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  delete(portfolioId: number) {
    this.dialogService.open(DialogAgreementPromptComponent)
      .onClose.subscribe(agree => {
        if (agree) {
          this.syndicatorService.deletePortfolio(this.syndicatorId, portfolioId)
            .subscribe(res => {
              this.refreshData();
            });
        }
    });


  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
<!--      <nb-icon icon="home"></nb-icon>-->
    </ng-template>
  `,
})
export class FsIcon2Component {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
