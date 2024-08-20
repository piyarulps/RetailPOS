import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-site-type-add-edit',
  templateUrl: './site-type-add-edit.component.html',
  styleUrls: ['./site-type-add-edit.component.scss']
})
export class SiteTypeAddEditComponent implements OnInit {

  dialogTitle = "Add Site Type";
  isDisabled: boolean = false;
  addModuleForm: FormGroup;
  moduleName: any;
  uomType: any[];
  retailStore: any[];
  parentPOSDepartment: any[];
  color = 'primary';
  couponRestricted: number = 0;
  checked = false;
  disabled = false;
  isLoading: boolean;
  submitted: boolean = false;
  btnValue: string;
  language: any;

  constructor(
    public _dialogRef: MatDialogRef<SiteTypeAddEditComponent>,
    private _formBuilder: FormBuilder,
    private _helper: HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
      siteTypeName: [null, Validators.required],
      descripition: ['']
    });
  }
  get f() {
    return this.addModuleForm.controls;
  }

  ngOnInit() {
    this.btnValue = "Create";
    this.addModuleForm.get('siteTypeName').patchValue(this._dialogData.newData);
    this.addModuleForm.get('descripition').patchValue(this._dialogData.newData);
  }
  //start: Submit Form
  public onSubmit() {
    this.isDisabled = true;
    this.isLoading = true;
    this.submitted = true;
    if (this.addModuleForm.invalid) {
      this.isLoading = false;
      this.isDisabled = false;
      return;
    }
    var postValue = this.addModuleForm.value;
    this._helper.apiPost(postValue, `itemapis/sitetype/`).subscribe(
      res => {
        if (res["message"]) {
          this._helper.notify({ message: res["message"], messageType: res["status"] });
        }
        this.isDisabled = false;
        this.isLoading = false;
        if (res["status"] == 1) {
          this._dialogRef.close(res);
        }
      },
      error => {
        this.isDisabled = false;
        this.isLoading = false;
      },
      () => {
      }
    );
  }
  //end: Submit Form

  // start:close dialog
  public backProgress() {
    this._dialogRef.close();
  }
  // end:close dialog

}

