import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PortfolioInterface} from '../interfaces/portfolio-interface';

export class Portfolio implements PortfolioInterface {
  id: Number;
  name: String;
  offeringName: string;
  customerName: string;
  amount: string;
  creationDate: string;
  priority: string;
  status: string;
  form: FormGroup;
  constructor(portfolio?: Portfolio | PortfolioInterface) {
    if (portfolio) {
      Object.assign(this, portfolio);
    }
    this.initForm();
  }
  initForm() {
    const formBuilder = new FormBuilder();
    const formSettings = {
      name: [this.name || '', [Validators.required]],
    };
    this.form = formBuilder.group(formSettings);
  }
}
