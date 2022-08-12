import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule, NbDialogService,
  NbIconModule,
  NbInputModule, NbStepperModule,
  NbTreeGridModule,
  NbWindowModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { PortfolioRoutingModule, routedComponents } from './portfolio-routing.module';
import { FsIcon2Component } from './profile-management/portfolio-management.component';
import {SyndicatorService} from '../../services/syndicator.service';
import {APIService} from '../../services/api-service.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PortfolioWizzardComponent } from './portfolio-wizzard/portfolio-wizzard.component';


const COMPONENTS = [
];

const ENTRY_COMPONENTS = [
];

const MODULES = [
  NbWindowModule.forChild(),
  NbButtonModule,
  ReactiveFormsModule,
  FormsModule,
  NbStepperModule,
];

const SERVICES = [
  NbDialogService,
];

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    PortfolioRoutingModule,
    Ng2SmartTableModule,
    ...MODULES,
  ],
  providers: [
    SyndicatorService,
    APIService,
  ],
  declarations: [
    ...routedComponents,
    FsIcon2Component,
    PortfolioWizzardComponent,
  ],
})
export class PortfolioModule { }
