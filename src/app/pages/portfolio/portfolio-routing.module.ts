import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PortfolioComponent} from './portfolio.component';
import { PortfolioManagementComponent } from './profile-management/portfolio-management.component';
import {
  WindowFormPortfolioComponent,
} from './profile-management/window-form-add-portfolio/window-form-portfolio.component';




const routes: Routes = [{
  path: '',
  component: PortfolioComponent,
  children: [
    {
      path: 'portfolio',
      component: PortfolioManagementComponent,
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
