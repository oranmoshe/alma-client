import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-agreement.component.html',
  styleUrls: ['dialog-agreement.component.scss'],
})
export class DialogAgreementPromptComponent {

  constructor(protected ref: NbDialogRef<DialogAgreementPromptComponent>) {}

  cancel() {
    this.ref.close(false);
  }

  agree() {
    this.ref.close(true);
  }
}
