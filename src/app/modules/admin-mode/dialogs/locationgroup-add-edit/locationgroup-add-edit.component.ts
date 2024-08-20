import { HelperService } from 'src/app/services/helper.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';

@Component({
  selector: 'app-locationgroup-add-edit',
  templateUrl: './locationgroup-add-edit.component.html',
  styleUrls: ['./locationgroup-add-edit.component.scss']
})
export class LocationgroupAddEditComponent implements OnInit {

  dialogTitle = "Add Location Group";
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
    public _dialogRef: MatDialogRef<LocationgroupAddEditComponent>,
    private _formBuilder: FormBuilder,
    private _helper: HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
      locationGroupName: [null, Validators.required],
    });
  }
  get f() {
    return this.addModuleForm.controls;
  }

  ngOnInit() {
    this.btnValue = "Create";
    console.log(this._dialogData);
    this.addModuleForm.get('locationGroupName').patchValue(this._dialogData.newData);
  }

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
    this._helper.apiPost(postValue, `itemapis/locationgroup/`).subscribe(
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
