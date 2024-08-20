
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-location-level-add-edit',
  templateUrl: './location-level-add-edit.component.html',
  styleUrls: ['./location-level-add-edit.component.scss']
})
export class LocationLevelAddEditComponent implements OnInit {


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
    public _dialogRef: MatDialogRef<LocationLevelAddEditComponent>,
    private _formBuilder: FormBuilder,
    private _helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
      description: [null, Validators.required],
      stockLedgerControlFlag:[false],
    });
  }
  get f() {
    return this.addModuleForm.controls;
  }

  ngOnInit() {
    this.btnValue = "Create";
    console.log(this._dialogData);
    this.addModuleForm.get('description').patchValue(this._dialogData.newData);
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
    this._helperService.apiPost(postValue, `itemapis/locationlevel`).subscribe(
      res => {
        if (res["message"]) {
          this._helperService.notify({ message: res["message"], messageType: res["status"] });
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
