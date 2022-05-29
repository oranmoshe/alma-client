import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { PortfolioRoutingModule, routedComponents } from './portfolio-routing.module';
import { FsIcon2Component } from './profile-management/portfolio-management.component';
import {SyndicatorService} from '../../services/syndicator.service';
import {APIService} from '../../services/api-service.service';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    PortfolioRoutingModule,
    Ng2SmartTableModule,
  ],
  providers: [
    SyndicatorService,
    APIService,
  ],
  declarations: [
    ...routedComponents,
    FsIcon2Component,
  ],
})
export class PortfolioModule { }
