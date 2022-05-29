import {SyndicatorInterface} from '../interfaces/syndicator-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class Syndicator implements SyndicatorInterface {
  id: Number;
  name: String;
  form: FormGroup;
  constructor(syndicator?: Syndicator | SyndicatorInterface) {
    if (syndicator) {
      Object.assign(this, syndicator);
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
