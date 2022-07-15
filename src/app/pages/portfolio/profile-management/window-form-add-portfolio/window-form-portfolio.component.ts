import {Component, Inject, Input, OnInit} from '@angular/core';
import { NB_WINDOW_CONTEXT, NbWindowRef} from '@nebular/theme';
import {Portfolio} from '../../../../classes/portfolio';
import {SyndicatorService} from '../../../../services/syndicator.service';

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
export class WindowFormPortfolioComponent implements OnInit {

  public portfolio: Portfolio = new Portfolio();
  public id: String;
  constructor(public windowRef: NbWindowRef,
              public syndicatorService: SyndicatorService,
              @Inject(NB_WINDOW_CONTEXT) context) {
    this.portfolio = context ? new Portfolio(context) : new Portfolio();
  }

  ngOnInit() {

  }

  close() {
    this.windowRef.close();
  }

  onSubmit() {
    if (this.portfolio.id) {
      this.syndicatorService.updatePortfolio(1, this.portfolio.form.value)
        .subscribe(res => {
          this.close();
        });
    } else {
      this.portfolio.form.get('creationDate').setValue((new Date).getTime().toString());
      this.syndicatorService.createPortfolio(1, this.portfolio.form.value)
        .subscribe(res => {
          this.close();
        });
    }
  }

}
