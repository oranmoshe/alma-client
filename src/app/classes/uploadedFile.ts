import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UploadedFileInterface, UploadType} from '../interfaces/uploadedFile-interface';

export class UploadedFile implements UploadedFileInterface {
  id: Number;
  name: string;
  path: string;
  uploadType: UploadType;
  form: FormGroup;
  constructor(uploadedFile?: UploadedFile | UploadedFileInterface) {
    if (uploadedFile) {
      Object.assign(this, uploadedFile);
    }
    this.initForm();
  }
  initForm() {
    const formBuilder = new FormBuilder();
    const formSettings = {
      id: [this.id || '', []],
      name: [this.name || '', [Validators.required]],
      path: [this.path || '', [Validators.required]],
      uploadType: [this.uploadType || '', [Validators.required]],
    };
    this.form = formBuilder.group(formSettings);
  }
}
