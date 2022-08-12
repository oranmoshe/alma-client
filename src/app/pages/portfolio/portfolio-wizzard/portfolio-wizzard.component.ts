import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Portfolio} from '../../../classes/portfolio';
import {SyndicatorService} from '../../../services/syndicator.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ngx-portfolio-wizzard',
  templateUrl: './portfolio-wizzard.component.html',
  styleUrls: ['./portfolio-wizzard.component.scss'],
})
export class PortfolioWizzardComponent implements OnInit {


  public portfolio: Portfolio = new Portfolio();
  public id: Number;
  files: File[] = new Array();
  images: Map<String, String> = new Map();


  constructor(private fb: FormBuilder,
              public syndicatorService: SyndicatorService,
              private route: ActivatedRoute) {
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

  ngOnInit(): void {
    this.initPortfolio();
  }

  initPortfolio() {
    if (this.id) {
      this.syndicatorService.getPortfolio(this.syndicatorService.getSyndicatorId(), +this.id)
        .subscribe((portfolio: Portfolio) => {
          this.portfolio = new Portfolio(portfolio);
        });
    } else {
      this.portfolio = new Portfolio();
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

  handleFileInput(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

  onUpload() {
    this.syndicatorService.uploadFile(this.syndicatorService.getSyndicatorId(), this.id, this.files)
      .subscribe(res => {
        const portfolio = res['body'];
        if (portfolio) {
          this.files = [];
          this.portfolio = new Portfolio(portfolio);
          this.portfolio.form.updateValueAndValidity();
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

  createImageFromBlob(image: Blob, id: number) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.images[id] = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  // loadPictures(files: File[]) {
  //   for (let i = 0; i < files.length; i++) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.images.push(reader.result as string);
  //     }
  //     reader.readAsDataURL(files[i]);
  //   }
  // }

  delete(id: number) {
    this.syndicatorService.removeFile(this.syndicatorService.getSyndicatorId(), this.id, id)
      .subscribe(res => {
        delete this.images[id];
        this.portfolio.uploadedFiles = this.portfolio.uploadedFiles.filter(f => f.id !== id);
        this.portfolio = new Portfolio(this.portfolio);
      });
  }
}
