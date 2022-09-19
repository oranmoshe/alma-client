import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PortfolioInterface} from '../interfaces/portfolio-interface';
import {UploadedFile} from './uploadedFile';

export class Portfolio implements PortfolioInterface {
  id: Number;
  name: string;
  offeringName: string;
  customerName: string;
  amount: string;
  creationDate: string;
  priority: string;
  status: string;
  location: string;
  uploadedFiles: UploadedFile[];
  summary: string;
  form: FormGroup;
  constructor(portfolio?: Portfolio | PortfolioInterface) {
    if (portfolio) {
      Object.assign(this, portfolio);
    }
    this.uploadedFiles = !this.uploadedFiles ? [] :
      this.uploadedFiles.map(uploadedFile => new UploadedFile(uploadedFile));
    this.initForm();
  }
  initForm() {
    const formBuilder = new FormBuilder();
    const formSettings = {
      id: [this.id || '', []],
      name: [this.name || '', [Validators.required]],
      offeringName: [this.offeringName || '', [Validators.required]],
      customerName: [this.customerName || '', [Validators.required]],
      amount: [this.amount || '', [Validators.required]],
      creationDate: [this.creationDate || '', [Validators.required]],
      priority: [this.priority || '', [Validators.required]],
      status: [this.status || '', [Validators.required]],
      location: [this.location || '', []],
      summary: [this.summary || '', [Validators.required]],
    };
    this.form = formBuilder.group(formSettings);

    const uploadedFilesFormArray = new FormArray(this.uploadedFiles.map(line => line.form));
    this.form.addControl('uploadedFiles', uploadedFilesFormArray);

  }
}
