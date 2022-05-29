import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PortfolioListInterface} from '../interfaces/portfolio-list-interface';

export class PortfolioList implements PortfolioListInterface {
  id: Number;
  name: string;
  activated: boolean;
  deactivation: string;
  form: FormGroup;
  constructor(portfolioList?: PortfolioList | PortfolioListInterface) {
    if (portfolioList) {
      Object.assign(this, portfolioList);
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
