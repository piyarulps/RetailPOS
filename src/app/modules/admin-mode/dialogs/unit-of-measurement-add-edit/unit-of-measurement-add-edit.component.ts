import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';
import { DialogsService } from 'src/app/services/dialogs.service';

export interface PageData {
  _editData: {
    data: [],
    newbrand: null
  }
}
export interface PeriodicElement {
  id: number;
}

@Component({
  selector: 'app-unit-of-measurement-add-edit',
  templateUrl: './unit-of-measurement-add-edit.component.html',
  styleUrls: ['./unit-of-measurement-add-edit.component.scss']
})
export class UnitOfMeasurementAddEditComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() pageData: PageData;
  @Output() getCommonData = new EventEmitter<{}>();

  moduleName: string = 'Unit Of Measurement';
  displayModuleName: string = 'Unit Of Measurement';
  moduleAPI: string = 'itemapis/unitofmeasurement/';
  moduleLink: string = 'admin-mode/unitofmeasurement';
  myForm: FormGroup;
  mfgList: any = [];
  submitted: boolean = false;
  BrandsList: any[];
  message: string;
  editData: any = [];
  dialogTitle: string = "Add New Unit Of Measurement";
  isDisabled: boolean = false;
  btnCreateTxt: string = "Create";
  btnUpdateTxt: string = "Update";
  BrandNameDropDownList: any = [];
  brandnameLoading: boolean = false;
  response: any;
  _source: any = {};
  tempObj: any;
  tag: boolean;
  public dataSource = new MatTableDataSource<PeriodicElement>();
  isSelectBox: boolean = false;
  isbtnLoaderShow = false;
  IsAnotherChecked: boolean = false;
  isOnline: boolean = true;
  receivedData: any;
  isOpenSidebar: boolean = false;
  processMode: { id: string; text: string; }[];
  parentPOSDepartment: any;
  retailStore: any;
  sellingRuleList: any;
  sellingRuleListBk: any;
  nacsData: any[];
  updateData: any;
  public updateValue = {
    id: [],
    data: null,
    previous: [],
    previousConversionData: [],
    mesurementData: []
  };
  public saveValue = {
    data: null,
    measurementUnit: []
  }
  TobeselectedValue: any;
  unitofMeasureCode: any;
  uomList: any;
  addModuleForm: FormGroup;
  unitofMeasureCodeSelectedSelectedArray: any[] = [];
  conversionData: any;
  unitofMeasureCodeForType: any;
  unitofMeasureCodeBk: any;
  SelectedValue: any;
  measurementData: any;
  openDialogToggle: boolean;
  uomListBk: any;

  constructor(
    private _helper: HelperService,
    private _formBuilder: FormBuilder,
    public _formDirective: FormGroupDirective,
    public _elasticsearchService: ElasticsearchService,
    public _connectionService: ConnectionService,
    private _hotkeysService: HotkeysService,
    private dialog: DialogsService,
  ) {
    this.isOnline = navigator.onLine;
    this._connectionService.monitor().subscribe(isConnected => {
      this.isOnline = isConnected;
    });
    this.addModuleForm = this._formBuilder.group({
      type: [null, Validators.required],
      metricType: ["1"],
      unitOfMeasurementCode: [null, Validators.required],
      name: ['', Validators.required],
      descripition: [''],
      // itemRows: this._formBuilder.array([this.initItemRows()])
    });
    this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
      this.doManage();
      return false; // Prevent bubbling
    }));
  }

  onNoClick() {
    this.getCommonData.emit({ openSidebar: false });
  }
  validateForm() {
    this.myForm = this._formBuilder.group({
      type: [null, Validators.required],
      metricType: ["1"],
      unitOfMeasurementCode: [null, Validators.required],
      name: ['', Validators.required],
      descripition: [''],
      // itemRows: this._formBuilder.array([this.initItemRows()])
    });
  }

  get f() {
    return this.addModuleForm.controls;
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

  ngOnChanges(changes: SimpleChanges) {
    this.validateForm();
    this.measurementData = [];
    this.conversionData = [];
    // const patchDynamically1 = this.addModuleForm.get('itemRows') as FormArray;
    // if (patchDynamically1.length != 0) {
    //   for (var i = 0; i < patchDynamically1.length; i++) {
    //     if (i != 0) {
    //       this.deleteRow(i);
    //     }
    //   }

    // }
    this.unitofMeasureCodeSelectedSelectedArray = []
    this.dataSource.data = [];
    this.receivedData = {};
    this.editData = [];
    const change: SimpleChange = changes.pageData;
    this.receivedData = change.currentValue;
    if (typeof (this.receivedData._editData) != "undefined") {
      if (typeof (this.receivedData._editData.data) != "undefined" && this.receivedData._editData.data != null) {
        this.editData = this.receivedData._editData.data;
        this.getForupdateData(this.editData);
      }
    }
    else {
      this.validateForm()
      this.dialogTitle = "Add Unit Of Measurement";
      this.resetForm(this.formGroupDirective, this.addModuleForm, "validateForm");
      // const patchDynamically1 = this.addModuleForm.get('itemRows') as FormArray;
      // if (patchDynamically1.length != 0) {
      //   for (var i = 0; i < patchDynamically1.length; i++) {
      //     if (i != 0) {
      //       this.deleteRow(i);
      //     }
      //   }

      // }
    }
  }

  ngOnInit() {
    this.dropDownData();
    this.measurementData = [];
    this.conversionData = [];
  }
  public getForupdateData(pageData) {
    this.editData = pageData;
    if (this.editData.length) {
      this.dialogTitle = "Update Unit Of Measurement";
      const type = this.addModuleForm.controls['type'];
      if (this.editData.length == 1) {
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/checkuom/`).subscribe(data => {
          this.updateData = data.data;
          this.conversionData = data.conversion;
          this.measurementData = this.conversionData;
          type.setValidators([Validators.required]);
          this.setCommonDataInForm();
          type.patchValue(this.updateData.MeasurementSystem);
          this.unitofMeasureCodeSelectedSelectedArray.push(this.updateData.UnitOfMeasureCode);
        });
      }
      else {
        type.clearValidators();
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/checkuom/`).subscribe(data => {
          this.updateData = data.data;
          this.setCommonDataInForm();
        });
      }
    }
  }
  //Start:This function used to update/set data for single and muliple data
  public setCommonDataInForm() {
    const patchDynamically1 = this.addModuleForm.get('itemRows') as FormArray;
    // console.log(patchDynamically1.length)
    // if (patchDynamically1.length != 0) {
    //   this.deleteRow(0)
    // }

    // for (var j = 0; j < this.conversionData.length; j++) {
    //   const patchDynamically = this.addModuleForm.get('itemRows') as FormArray;
    //   patchDynamically.push(this._formBuilder.group({
    //     number: [this.conversionData[j].Amount, [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
    //     type: [this.conversionData[j].ConvertsToName]
    //   }));
    // }

    this.addModuleForm.patchValue({
      metricType: this.updateData.EnglishMetricFlag == null ? "" : this.updateData.EnglishMetricFlag.toString(),
      unitOfMeasurementCode: this.updateData.UnitOfMeasureCode == null ? "" : this.updateData.UnitOfMeasureCode,
      name: this.updateData.Name == null ? "" : this.updateData.Name,
      descripition: this.updateData.Description == null ? "" : this.updateData.Description,
    });
  }
  //End:This function used to update/set data for single and muliple data
  public pushAllIdInArray(allId) {
    this.updateValue.id = [];
    for (let edit of allId) {
      this.updateValue.id.push(edit.id);
    }
  }

  public dropDownData() {
    this.getUomTypeList();
    this.getUnitofMeasureCode();
  }
  // Start: Get Unit Of Measurement  For Ng Select
  // public getUomTypeList() {
  //   this._helper.apiGet('itemapis/uomlist/?colname=Name&').subscribe(
  //     data => {

  //       if (data["status"] == 1) {
  //         this.uomList = data["result"];
  //       }
  //     },
  //     error => console.log(error)
  //   );
  // }
  public clear() {
    console.log("hi");
  }

  // End: Get Unit Of Measurement  For Ng Select


  public getUnitofMeasureCode(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/uomlist/?colname=UnitOfMeasureCode&').subscribe(
      data => {

        if (data["status"] == 1) {
          this.unitofMeasureCode = data["result"];
          this.unitofMeasureCodeForType = data["result"];
          this.unitofMeasureCodeBk = this.unitofMeasureCode
        }
        if (isSelectionRequired != 0) {
          this.addModuleForm.controls['unitOfMeasurementCode'].setValue(this.SelectedValue);
        }
      },
      error => console.log(error)
    );
  }
  // public unitofMeasureCodeChange(event) {
  //   this.unitofMeasureCodeSelectedSelectedArray = []
  //   this.unitofMeasureCodeSelectedSelectedArray.push(this.f.unitOfMeasurementCode.value);
  //   for (var i = 0; i < this.formArr.value.length; i++) {
  //     this.unitofMeasureCodeSelectedSelectedArray.push(this.formArr.value[i].type);
  //   }
  // }
  public unitofMeasureCodeTypeChange(event) {
    this.unitofMeasureCodeSelectedSelectedArray = []
    this.unitofMeasureCodeSelectedSelectedArray.push(this.f.unitOfMeasurementCode.value);
    for (var i = 0; i < this.formArr.value.length; i++) {
      this.unitofMeasureCodeSelectedSelectedArray.push(this.formArr.value[i].type);
    }
  }



  doManage() {
    if (this.editData.length) {
      this.isbtnLoaderShow = true;
      this.btnUpdateTxt = "Please Wait..";
      // if (this.myForm.invalid) {
      //   this.myForm.controls.departmentName.markAsTouched();
      //   this.myForm.controls.departmentNumber.markAsTouched();
      //   this.btnUpdateTxt = "Update";
      //   this.isbtnLoaderShow = false;
      //   return;
      // }
      this.pushAllIdInArray(this.editData)
      this.updateValue.data = this.addModuleForm.value;
      this.updateValue.previousConversionData = this.conversionData;
      this.updateValue.previous = this.updateData;
      this.updateValue.mesurementData = this.measurementData;
      this._helper.apiPut(this.updateValue, this.moduleAPI).subscribe(
        res => {
          this._helper.notify({ message: res.message, messageType: res.status });
          if (res.status == 1) {
            this.submitted = false;
            this.resetForm(this.formGroupDirective, this.addModuleForm, "validateForm");
            this.isbtnLoaderShow = false;
            this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true });
          }
          this.btnUpdateTxt = "Update";
          this.isbtnLoaderShow = false;
        },
        error => {
          this.isbtnLoaderShow = false;
          this.btnUpdateTxt = "Update";
        },
        () => {
        }
      );
    }
    else {
      this.btnCreateTxt = "Please Wait..";
      this.submitted = true;
      if (this.addModuleForm.invalid) {
        this.btnCreateTxt = "Create";
        this.isDisabled = false;
        return;
      }
      this.isbtnLoaderShow = true;
      if (this.isOnline) {
        var postValue = this.addModuleForm.value;
        this.saveValue.data = this.addModuleForm.value;
        this.saveValue.measurementUnit = this.measurementData;
        this._helper.apiPost(this.saveValue, this.moduleAPI).subscribe(
          res => {
            if (res.message) {
              this._helper.notify({ message: res.message, messageType: res.status });
            }
            if (res.status == 1) {
              this.submitted = false;
              this.resetForm(this.formGroupDirective, this.addModuleForm, "validateForm");
              this.isbtnLoaderShow = false;
              if (this.IsAnotherChecked == true) {
                this.submitted = false;
                this.resetForm(this.formGroupDirective, this.addModuleForm, "validateForm");
                this.isbtnLoaderShow = false;
              } else {
                this.getCommonData.emit({ openSidebar: false, dataAdded: this.addModuleForm.value });
              }
            }
            this.btnCreateTxt = "Create";
            this.isbtnLoaderShow = false;
          },
          error => {
            console.log('error', error);
            this.btnCreateTxt = "Create";
          }
        );
      }
      else {
        // var myThis = this;
        // this._helper.thisDb().brands().find({ BrandName: myThis.myForm.value.BrandName }, function (err, data) {
        //   myThis.btnCreateTxt = "Create";
        //   myThis.isbtnLoaderShow = false;
        //   if (!data.length) {
        //     myThis._helper.thisDb().brands().insert(myThis.myForm.value, function (err, data) {
        //       // console.log('insert', data);
        //       this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value });
        //       // myThis._snackBar.open('Brand created successfully.');
        //       this._helper.notify({ message: 'Brand created successfully.', messageType: 1 });
        //     });
        //   }
        //   else {
        //     // myThis._snackBar.open('Brand already exist.');
        //     this._helper.notify({ message: 'Brand already exist.', messageType: 0 });
        //   }
        // });
      }
    }
  }
  resetForm(_formGroupDirective: FormGroupDirective, _formGroup: FormGroup, _functionName: string): void {
    _formGroupDirective.resetForm();
    _formGroup.reset();
    this[_functionName]();
  }
  openDialog() {
    this.myForm.controls.unitOfMeasurementCode.markAsTouched();
    this.myForm.controls.unitOfMeasurementCode.markAsDirty();
    this.openDialogToggle = true;
    if (this.f.unitOfMeasurementCode.value != null) {
      this.dialog.conversionUnitDialog(this.f.unitOfMeasurementCode.value, this.conversionData).subscribe(res => {
        if (res) {
          this.measurementData = res.itemRows;
          this.conversionData = res.itemRows;


        }
      });
    }
  }

  // Start: Get Unit Of Measurement  For Ng Select
  public getUomTypeList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/uomlist/?colname=Name&').subscribe(
      data => {

        if (data["status"] == 1) {
          this.uomList = data["result"];
          this.uomListBk = this.uomList;
        }
        if (isSelectionRequired != 0) {
          this.addModuleForm.controls['type'].setValue(this.SelectedValue);
        }

        this.uomList = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get Unit Of Measurement  For Ng Select

  public onTypeChange(event) {
    if (typeof (event) != "undefined") {
      if (typeof (event.id) != "undefined") {
        this.uomList = [];
        this.tempObj = {
          id: event.id,
          text: event.text
        };
        this.uomList = this.uomListBk;
        this.uomList.push(this.tempObj);
        this.addModuleForm.controls['type'].setValue(event.id);
      } else {
        this.addMeasurementType(event.text);
      }
    }
  }
  addMeasurementType(data) {
    this.dialog.unitOfMeasurementTypeDialog(data).subscribe(res => {
      if (res) {
        this.SelectedValue = res.result;
      }
      this.getUomTypeList(1);
    }
    );
  }







}
