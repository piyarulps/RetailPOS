
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-add-unit-of-measurement-type',
  templateUrl: './add-unit-of-measurement-type.component.html',
  styleUrls: ['./add-unit-of-measurement-type.component.scss']
})
export class AddUnitOfMeasurementTypeComponent implements OnInit {


  dialogTitle = "Add Measurement Type";
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
 
  constructor(
    public _dialogRef: MatDialogRef<AddUnitOfMeasurementTypeComponent>,
    private _formBuilder: FormBuilder,
    private _helper:HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
      typeName: [null, Validators.required],
    });
  }
  get f() {
    return this.addModuleForm.controls;
  }

  ngOnInit() {
    this.btnValue = "Create";
    
    this.addModuleForm.get('typeName').patchValue(this._dialogData.newData);

  }

  public onSubmit() {
    this.isDisabled = true;
    this.isLoading = true;
    if (this.addModuleForm.invalid) {
      this.isLoading = false;
      this.isDisabled = false;
      return;
    }
    var postValue = this.addModuleForm.value;
    this._helper.apiPost(postValue, `itemapis/addUomType/`).subscribe(
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
  public backProgress()
  {
    this._dialogRef.close();
  }

}
