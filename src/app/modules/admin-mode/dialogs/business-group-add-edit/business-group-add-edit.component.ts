import { HelperService } from '../../../../services/helper.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';

@Component({
  selector: 'app-business-group-add-edit',
  templateUrl: './business-group-add-edit.component.html',
  styleUrls: ['./business-group-add-edit.component.scss']
})
export class BusinessGroupAddEditComponent implements OnInit {

  dialogTitle = "Add Group";
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
    public _dialogRef: MatDialogRef<BusinessGroupAddEditComponent>,
    private _formBuilder: FormBuilder,
    private _genericService: HelperService,
    private _globalService: HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
      groupName: [null, Validators.required],
      language: [null],
    });
  }
  get f() {
    return this.addModuleForm.controls;
  }

  ngOnInit() {
    this.btnValue = "Create";
    console.log(this._dialogData);
    this.addModuleForm.get('groupName').patchValue(this._dialogData.newData);
    this.getLanguageList();
  }
  // start:dropdownList
  public getLanguageList() {
    this._genericService.apiGet('itemapis/businessunitdrp/?colname=Language&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.language = data["result"];
        }
      },
      error => console.log(error)
    );
  }
  // end:dropdownList

  //start: Submit Form
  public onSubmit() {
    this.isDisabled = true;
    this.isLoading = true;
    if (this.addModuleForm.invalid) {
      this.isLoading = false;
      this.isDisabled = false;
      return;
    }
    var postValue = this.addModuleForm.value;
    this._genericService.apiPost(postValue, `itemapis/businessunitgrp/`).subscribe(
      res => {
        if (res["message"]) {
          this._globalService.notify({ message: res["message"], messageType: res["status"] });
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
