import {Component, Input} from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import {Portfolio} from '../../../../classes/portfolio';
import {APIService} from '../../../../services/api-service.service';
import {SyndicatorService} from "../../../../services/syndicator.service";

@Component({
  template: `
    <form class="form" [formGroup]="portfolio.form" (ngSubmit)="onSubmit()">
      <label for="name">Name:</label>
      <input nbInput id="name" type="text" formControlName="name">
      <label class="text-label" for="offeringName">Offering Name:</label>
      <input nbInput id="offeringName" type="text" formControlName="offeringName">
      <label class="text-label" for="customerName">Customer Name:</label>
      <input nbInput id="customerName" type="text" formControlName="customerName">
      <label class="text-label" for="amount">Amount:</label>
      <input nbInput id="amount" type="text" formControlName="amount">
      <label class="text-label" for="priority">Priority:</label>
      <input nbInput id="priority" type="text" formControlName="priority">
      <label class="text-label" for="status">Status:</label>
      <input nbInput id="status" type="text" formControlName="status">
      <button nbButton status="primary" outline>Save</button>
    </form>
  `,
  styleUrls: ['window-form-portfolio.component.scss'],
})
export class WindowFormPortfolioComponent {

  @Input()
  public portfolio: Portfolio = new Portfolio();

  constructor(public windowRef: NbWindowRef,
              public syndicatorService: SyndicatorService) {}

  close() {
    this.windowRef.close();
  }

  onSubmit() {
    this.portfolio.form.get('creationDate').setValue((new Date).getTime().toString());
    this.syndicatorService.createPortfolio(1, this.portfolio.form.value)
      .subscribe(res => {
        this.close();
      });
  }

}
