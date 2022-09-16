import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder} from '@angular/forms';
import {Portfolio} from '../../../classes/portfolio';
import {SyndicatorService} from '../../../services/syndicator.service';
import {ActivatedRoute} from '@angular/router';
import {EditorChangeContent, EditorChangeSelection} from 'ngx-quill';
import {UploadType} from '../../../interfaces/uploadedFile-interface';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CanComponentDeactivate} from '../../../services/can-deactivate-guard.service';

@Component({
  selector: 'ngx-portfolio-wizzard',
  templateUrl: './portfolio-wizzard.component.html',
  styleUrls: ['./portfolio-wizzard.component.scss'],
})
export class PortfolioWizzardComponent implements OnInit, CanComponentDeactivate {

  canDeactivate(): Observable<boolean> | boolean {
    if (this.unSaved) {
      const result = window.confirm('There are unsaved changes! Are you sure?');
      return result;
    }
    return true;
  }
  unSaved: boolean = false;
  public portfolio: Portfolio = new Portfolio();
  public id: Number;
  // gallery
  files: File[] = new Array();
  docs: File[] = new Array();
  images: Map<String, String> = new Map();
  // quill
  blured = false;
  focused = false;

  constructor(private fb: FormBuilder,
              public syndicatorService: SyndicatorService,
              private route: ActivatedRoute,
              private router: Router,
              private ngxService: NgxUiLoaderService) {
    this.route.params.subscribe( params => this.id = params['portfolioId'] );
  }

  get portfolioForm() {
    return this.portfolio.form;
  }

  get uploadedFilesForm() {
    return this.portfolio.form.controls['uploadedFiles'] as FormArray;
  }

  getUploadedFilesFormItem(index) {
    return (this.portfolio.form.controls['uploadedFiles'] as FormArray).controls[index].value;
  }

  getSummaryContent() {
    return (this.portfolio.form.controls['summary']).value;
  }

  ngOnInit(): void {
    this.initPortfolio();
  }

  initPortfolio() {
    if (this.id) {
      this.syndicatorService.getPortfolio(this.syndicatorService.getSyndicatorId(), +this.id)
        .subscribe((portfolio: Portfolio) => {
          this.portfolio = new Portfolio(portfolio);
          this.portfolio.form.statusChanges.subscribe(change => this.unSaved = change);
          this.portfolio.uploadedFiles
            .filter(u => u.uploadType === UploadType.Gallery)
            .forEach((f, i) => {
              this.downloadFile(f.id);
            });
        });
    } else {
      this.portfolio = new Portfolio();
      this.portfolio.form.statusChanges.subscribe(change => this.unSaved = change);
    }
  }

  onSubmitStep1() {
    if (this.portfolio.id) {
      // existing portfolio
      this.syndicatorService.updatePortfolio(this.syndicatorService.getSyndicatorId(), this.portfolio.form.value)
        .subscribe(res => {
        });
    } else {
      // new portfolio
      this.portfolio.form.get('creationDate').setValue((new Date).getTime().toString());
      this.syndicatorService.createPortfolio(this.syndicatorService.getSyndicatorId(), this.portfolio.form.value)
        .subscribe((res: Portfolio) => {
          this.id = res.id;
        });
    }
  }

  handleFileInput(files: FileList, uploadType: string) {
    for (let i = 0; i < files.length; i++) {
      switch (uploadType) {
        case 'Gallery': {
          this.files.push(files[i]);
          break;
        }
        case 'Document': {
          this.docs.push(files[i]);
          break;
        }
      }
    }
  }

  onUpload(uploadType: string) {
    this.ngxService.start();
    this.syndicatorService.uploadFile(this.syndicatorService.getSyndicatorId(), this.id,
      uploadType === 'Gallery' ? this.files : this.docs, uploadType)
      .subscribe(res => {
        const portfolio = res['body'];
        if (portfolio) {
          if (uploadType === 'Gallery') {
            this.files = [];
            this.ngxService.stop();
          } else {
            this.docs = [];
            this.ngxService.stop();
          }
          this.portfolio = new Portfolio(portfolio);
          this.portfolio.form.updateValueAndValidity();
          this.portfolio.uploadedFiles
            .filter(u => !this.images[u.id + ''])
            .forEach(u => {
              this.downloadFile(u.id);
            });
        }
        // if (res['total'] && res['loaded'] && res['total'] === res['loaded'])
        //   this.loadPictures(this.files)
        // this.rout.navigate(['/pages/portfolio/portfolio']);
      });
  }

  downloadFile(id) {
    if (!this.images[id]) {
      this.images[id] = true;
      this.syndicatorService.downloadFile(this.syndicatorService.getSyndicatorId(), this.id, id)
        .subscribe((res: Blob) => {
          this.createImageFromBlob(res, id);
        });
    } else {
      return this.images[id];
    }
  }

  getCachedImage(id) {
    return this.images[id];
  }

  createImageFromBlob(image: Blob, id: number) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.images[id] = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  delete(index: number, uploadType: string) {
    const uploadedFile =  this.getUploadedFilesFormItem(index);
    const id = uploadedFile && uploadedFile.id || undefined;
    if (id) {
      this.syndicatorService.removeFile(this.syndicatorService.getSyndicatorId(), this.id, id)
        .subscribe(res => {
          if (uploadType === 'Gallery')
            delete this.images[id];
         // if (uploadType === 'Gallery')
           // delete this.images[id];
          this.portfolio.uploadedFiles = this.portfolio.uploadedFiles.filter(f => f.id !== id);
          this.portfolio = new Portfolio(this.portfolio);
        });
    }
  }

  //
  // Quill https://www.freakyjolly.com/angular-rich-text-editor-quill-with-image-resizer-emoji-mentions-tutorial/
  //

  created(event: any) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  timeout = undefined;
  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event);
    if (event['html']) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout((function() {
        this.portfolio.form.controls['summary'].setValue(event['html']);
      }).bind(this), 1000);
    }
  }

  focus($event: any) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event);
    this.focused = true;
    this.blured = false;
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event);
    this.focused = false;
    this.blured = true;
  }

  filterUpload(controls: AbstractControl[], uploadType: string) {
    return controls.filter(d => d.value.uploadType === uploadType);
  }

  onPreview() {
    console.log('preview');
  }

  onCancel() {
    this.router.navigate(['/portfolio/portfolio']);
  }
}
