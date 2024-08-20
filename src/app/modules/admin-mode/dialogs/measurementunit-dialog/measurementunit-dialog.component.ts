
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-measurementunit-dialog',
  templateUrl: './measurementunit-dialog.component.html',
  styleUrls: ['./measurementunit-dialog.component.scss']
})
export class MeasurementunitDialogComponent implements OnInit {

  dialogTitle = "Add Conversion Unit";
  btnValue = "Create"
  isDisabled: boolean;
  isLoading: boolean;
  addModuleForm: FormGroup;
  unitofMeasureCodeSelectedSelectedArray: any[] = [];
  unitofMeasureCode: any;
  conversionData: any;


  constructor(
    public _dialogRef: MatDialogRef<MeasurementunitDialogComponent>,
    private _formBuilder: FormBuilder,
    private helper: HelperService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any
  ) {
    this.addModuleForm = this._formBuilder.group({
      itemRows: this._formBuilder.array([this.initItemRows()])
    });
  }
  ngOnInit() {
    this.getDropDownData();
    this.unitofMeasureCodeSelectedSelectedArray.push(this._dialogData.data);
    console.log(this._dialogData.data);
    if (this._dialogData.arrayData.length != 0) {
      const patchDynamically1 = this.addModuleForm.get('itemRows') as FormArray;
      if (patchDynamically1.length != 0) {
        this.deleteRow(0)
      }
      this.conversionData = this._dialogData.arrayData;
      for (var j = 0; j < this.conversionData.length; j++) {
        const patchDynamically = this.addModuleForm.get('itemRows') as FormArray;
        patchDynamically.push(this._formBuilder.group({
          number: [this.conversionData[j].number, [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
          type: [this.conversionData[j].type]
        }));
        for (var i = 0; i < this.formArr.value.length; i++) {
          this.unitofMeasureCodeSelectedSelectedArray.push([this.conversionData[j].type]);
        }
      }

      
      this.unitofMeasureCodeTypeChange(null);

    } 
    // else if (this._dialogData.measurementDataForUpdate.length != 0) {
    //   const patchDynamically1 = this.addModuleForm.get('itemRows') as FormArray;
    //   if (patchDynamically1.length != 0) {
    //     this.deleteRow(0)
    //   }
    //   this.conversionData = this._dialogData.measurementDataForUpdate;
    //   for (var j = 0; j < this.conversionData.length; j++) {
    //     const patchDynamically = this.addModuleForm.get('itemRows') as FormArray;
    //     patchDynamically.push(this._formBuilder.group({
    //       number: [this.conversionData[j].Amount, [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
    //       type: [this.conversionData[j].ConvertsToName]
    //     }));
    //     for (var i = 0; i < this.formArr.value.length; i++) {
    //       this.unitofMeasureCodeSelectedSelectedArray.push(this.conversionData[j].ConvertsToName);
    //     }

    //   }

     


    // }
  }
  get f() {
    return this.addModuleForm.controls;
  }
  public getDropDownData() {
    this.helper.apiGet('itemapis/uomlist/?colname=UnitOfMeasureCode&').subscribe(res => {
      if (res["status"] == 1) {
        this.unitofMeasureCode = res["result"];
      }
    });
  }
  public unitofMeasureCodeTypeChange(event) {
    this.unitofMeasureCodeSelectedSelectedArray = [];
    this.unitofMeasureCodeSelectedSelectedArray.push(this._dialogData.data);
    for (var i = 0; i < this.formArr.value.length; i++) {
      this.unitofMeasureCodeSelectedSelectedArray.push(this.formArr.value[i].type);
    }
  }


  //Start: multi add related
  get formArr() {
    return this.addModuleForm.get('itemRows') as FormArray;
  }
  initItemRows() {
    return this._formBuilder.group({
      number: [null, [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
      type: [null]
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    for (var i = 0; i < this.unitofMeasureCodeSelectedSelectedArray.length; i++) {
      if (this.unitofMeasureCodeSelectedSelectedArray[i] === this.formArr.value[index].type) {
        this.unitofMeasureCodeSelectedSelectedArray.splice(i, 1);
      }
    }
    this.formArr.removeAt(index);
  }
  //End: multi add related

  //start: Submit Form
  public onSubmit() {
    this._dialogRef.close(this.addModuleForm.value);
  }
  //end: Submit Form

  // start:close dialog
  public backProgress() {
    this._dialogRef.close();
  }
  // end:close dialog

}
