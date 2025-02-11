import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PortfolioComponent} from './portfolio.component';
import { PortfolioManagementComponent } from './profile-management/portfolio-management.component';
import {
  WindowFormPortfolioComponent,
} from './profile-management/window-form-add-portfolio/window-form-portfolio.component';
import {PortfolioWizzardComponent} from './portfolio-wizzard/portfolio-wizzard.component';
import {CanDeactivateGuard} from '../../services/can-deactivate-guard.service';




const routes: Routes = [{
  path: '',
  component: PortfolioComponent,
  children: [
    {
      path: 'portfolio',
      component: PortfolioManagementComponent,
    },
    {
      path: 'wizzard/:portfolioId',
      component: PortfolioWizzardComponent,
      canDeactivate: [CanDeactivateGuard],
    },
    {
      path: 'wizzard',
      component: PortfolioWizzardComponent,
      canDeactivate: [CanDeactivateGuard],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule { }

export const routedComponents = [
  PortfolioComponent,
  PortfolioManagementComponent,
  WindowFormPortfolioComponent,
];
