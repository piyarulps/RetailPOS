import { DialogsService } from '../../../../services/dialogs.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatTableDataSource, MatDatepicker } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';


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
  selector: 'app-location-manage',
  templateUrl: './location-manage.component.html',
  styleUrls: ['./location-manage.component.scss']
})
export class LocationManageComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() pageData: PageData;
  @Output() getCommonData = new EventEmitter<{}>();

  moduleName: string = 'Location';
  displayModuleName: string = 'Location';
  moduleAPI: string = 'itemapis/location/';
  moduleLink: string = 'admin-mode/location';
  addModuleForm: FormGroup;
  mfgList: any = [];
  submitted: boolean = false;
  BrandsList: any[];
  message: string;
  editData: any = [];
  dialogTitle: string = "Add New Location";
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
    nacs: [],
    previous: []
  };
  typeCode: any;
  localCurrency: any;
  ISOCurrency: any;
  currencyType: any;
  businessSite: any;
  showTypeCodeRelatedField: boolean;
  operatingParty: any;
  SelectedOperationPartyValue: any;
  businessGroup: any;
  businessGroupBk: any;
  operatingPartyBk: any;
  SelectedValue: any;
  checkTypeCode: boolean;
  language: any;
  locationGroupList: any;
  locationGroupListBk: any;
  LocationTypeList: any;
  LocationTypeListBK: any;
  LocationLevelList: any;
  LocationLevelListBK: any;
  MeasurementCodeList: any;
  MeasurementCodeListBK: any;
  BusinessSiteIdList: any;
  BusinessSiteIdListBK: any;
  LocationFunctionList: any;
  LocationFunctionListBK: any;
  SelectedLocationGroupValue: any;
  parentLocationListBK: any;
  parentLocationList: any;
  SelectedLocationLevelValue: any;
  SelectedLocationTypeValue: any;
  public submitValue = {
    submitData: null,
  };
  businessUnitList: any;
  businessUnitListBK: any;
  venderList: any;
  venderListBk: any;
  checkLocationFunction: boolean;

  constructor(
    private _helper: HelperService,
    private _formBuilder: FormBuilder,
    public _formDirective: FormGroupDirective,
    public _elasticsearchService: ElasticsearchService,
    public _connectionService: ConnectionService,
    private _hotkeysService: HotkeysService,
    private dialogsService: DialogsService
  ) {
    this.isOnline = navigator.onLine;
    this._connectionService.monitor().subscribe(isConnected => {
      this.isOnline = isConnected;
    });

    this.validateForm();
    this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
      this.doManage();
      return false; // Prevent bubbling
    }));
  }

  onNoClick() {
    this.getCommonData.emit({ openSidebar: false });
  }

  validateForm() {
    this.addModuleForm = this._formBuilder.group({
      locationText: [null, Validators.required],
      parentLocationID: [null],
      locationGroup: [null],
      locationType: [null],
      sizeQuantity: [null, [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
      businessSiteId: [null],
      locationLevel: [null],
      locationFunction: [null],
      measurementCode: [null],
      functionCode: [''],
      securityClassCode: [''],
      nonSellingPublicAreaDescripition: [''],
      businessUnitId: [null],
      size: [''],
      venderId: [null],
      workLocationBusinessUnit: [null]
    });
  }
  get f() {
    return this.addModuleForm.controls;
  }
  ngOnChanges(changes: SimpleChanges) {
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
      this.dialogTitle = "Add  Location";
      this.resetForm(this.formGroupDirective, this.addModuleForm, "validateForm");
    }
  }

  ngOnInit() {
    this.dropDownData();
  }

  public getForupdateData(pageData) {
    this.editData = pageData;
    if (this.editData.length) {
      this.dialogTitle = "Update Location";
      const locationText = this.addModuleForm.get('locationText');
      // const typeCode = this.addModuleForm.get('typeCode');
      if (this.editData.length == 1) {
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/retrievelocation/`).subscribe(data => {
          this.updateData = data.result;
          locationText.setValidators([Validators.required]);
          this.setCommonDataInForm();
          locationText.patchValue(this.updateData.locationText);
          this.checkTypeCode = true;
          if (this.addModuleForm.value.typeCode == 1) {
            this.showTypeCodeRelatedField = false;
          }
          else {
            this.showTypeCodeRelatedField = true;
          }
        });
      }
      else {
        locationText.clearValidators();
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/retrievelocation/`).subscribe(data => {
          this.updateData = data.result;
          this.setCommonDataInForm();
          this.checkTypeCode = true;
          if (this.addModuleForm.value.typeCode == 1) {
            this.showTypeCodeRelatedField = false;
          }
          else {
            this.showTypeCodeRelatedField = true;
          }
        });
      }
    }
  }
  public setCommonDataInForm() {
    console.log(this.updateData);
    this.addModuleForm.patchValue({
      parentLocationID: this.updateData.parentLocationID == null ? "" : this.updateData.parentLocationID,
      locationGroup: this.updateData.locationHierarchyGroupID == null ? "" : this.updateData.locationHierarchyGroupID,
      locationType: this.updateData.locationTypeCode == null ? "" : this.updateData.locationTypeCode,
      sizeQuantity: this.updateData.sizeQuantity == null ? "" : this.updateData.sizeQuantity,
      businessSiteId: this.updateData.siteID == null ? "" : this.updateData.siteID,
      locationLevel: this.updateData.locationLevelID == null ? "" : this.updateData.locationLevelID,
      locationFunction: this.updateData.functionCode == null ? "" : this.updateData.functionCode,
      functionCode: this.updateData.FunctionCode == null ? "" : this.updateData.FunctionCode,
      measurementCode: this.updateData.sizeUnitOfMeasureCode == null ? "" : this.updateData.sizeUnitOfMeasureCode,
      securityClassCode: this.updateData.securityClassCode == null ? "" : this.updateData.securityClassCode,
      nonSellingPublicAreaDescripition: this.updateData.nonSellingPublicAreaDescripition == null ? "" : this.updateData.nonSellingPublicAreaDescripition,
      businessUnitId: this.updateData.businessUnitId == null ? "" : this.updateData.businessUnitId,
      size: this.updateData.size == null ? "" : this.updateData.size,
      venderId: this.updateData.venderId == null ? "" : this.updateData.venderId,
      workLocationBusinessUnit: this.updateData.workLocationBusinessUnit == null ? "" : this.updateData.workLocationBusinessUnit
    });
  }
  public pushAllIdInArray(allId) {
    this.updateValue.id = [];
    for (let edit of allId) {
      this.updateValue.id.push(edit.id);
    }
  }

  public dropDownData() {

    this._helper.apiGet('itemapis/drpdwnlocation/?colname=UnitOfMeasure&').subscribe(
      res => {
        this.MeasurementCodeList = res.result;
        this.MeasurementCodeListBK = res.result;
      }
    )
    this._helper.apiGet('itemapis/drpdwnlocation/?colname=Site&').subscribe(
      res => {
        this.BusinessSiteIdList = res.result;
        this.BusinessSiteIdListBK = res.result;
      }
    )
    this._helper.apiGet('itemapis/drpdwnlocation/?colname=FunctionCode&').subscribe(
      res => {
        this.LocationFunctionList = res.result;
        this.LocationFunctionListBK = res.result;
      }
    )
    this._helper.apiGet('itemapis/drpdwnlocation/?colname=Parentlocation&').subscribe(
      res => {
        this.parentLocationList = res.result;
        this.parentLocationListBK = res.result;
      }
    )

    this._helper.apiGet('itemapis/drpdwnlocation/?colname=BusinessUnit&').subscribe(
      res => {
        this.businessUnitList = res.result;
        this.businessUnitListBK = res.result;
      }
    )

    this._helper.apiGet('itemapis/drpdwnlocation/?colname=Vendor&').subscribe(
      res => {
        this.venderList = res.result;
        this.venderListBk = res.result;
      }
    )
    this.getLocationGroupList();
    this.getLocationTypeList();
    this.getLocationLevelList();
  }

  // Start: all about location Group
  // Start: Get Location Group  For Ng Select
  public getLocationGroupList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/drpdwnlocation/?colname=LocationGroup&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.locationGroupList = data.result;
          this.locationGroupListBk = data.result;
        }
        if (isSelectionRequired != 0) {
          this.addModuleForm.controls['locationGroup'].setValue(this.SelectedLocationGroupValue);
        }
        this.locationGroupList = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get location Group  For Ng Select

  // start: On Ng Select Change Add Value
  public onLocationGroupChange(event) {
    if (typeof (event.id) != "undefined") {
      this.locationGroupList = [];
      this.tempObj = {
        id: event.id,
        text: event.text
      };
      this.locationGroupList = this.locationGroupListBk;
      this.locationGroupList.push(this.tempObj);
      this.addModuleForm.controls['locationGroup'].setValue(event.id);
    } else {
      this.addLocationGroup(event.text);
    }
  }
  // end : On Ng Select Change Add Value
  addLocationGroup(data) {
    this.dialogsService.locationGroupDialog([], data).subscribe(res => {
      if (res) {
        this.SelectedLocationGroupValue = res.result;
      }
      this.getLocationGroupList(1);
    }
    );
  }
  // public operationPartyDialog(data: any = [], valueByOnType: string = null): Observable<any> {
  //   var dialogConfig = new MatDialogConfig();
  //   dialogConfig.panelClass = 'mid-pop';
  //   dialogConfig.data = { data: data, newData: valueByOnType };
  //   let dialogRef: MatDialogRef<LocationgroupAddEditComponent>;
  //   dialogRef = this.dialog.open(LocationgroupAddEditComponent, dialogConfig);
  //   return dialogRef.afterClosed();
  // }
  // End: all about location Group

  // start : all about location Type
  // Start: Get location Type  For Ng Select
  public getLocationTypeList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/drpdwnlocation/?colname=LocationType&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.LocationTypeList = data.result;
          this.LocationTypeListBK = data.result;
        }
        if (isSelectionRequired != 0) {
          this.addModuleForm.controls['locationType'].setValue(this.SelectedLocationTypeValue);
        }
        this.LocationTypeList = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get location Type  For Ng Select
  // start: On Ng Select Change Add Value
  public onLocationTypeChange(event) {
    if (typeof (event.id) != "undefined") {
      this.LocationTypeList = [];
      this.tempObj = {
        id: event.id,
        text: event.text
      };
      this.LocationTypeList = this.LocationTypeListBK;
      this.LocationTypeList.push(this.tempObj);
      this.addModuleForm.controls['locationType'].setValue(event.id);
    } else {
      this.addLocationType(event.text);
    }
  }
  //end : On Ng Select Change Add Value
  addLocationType(data) {
    this.dialogsService.locationTypeDialog([], data).subscribe(res => {
      if (res) {
        this.SelectedLocationTypeValue = res.result;
      }
      this.getLocationTypeList(1);
    }
    );
  }
  // public locationTypeDialog(data: any = [], valueByOnType: string = null): Observable<any> {
  //   var dialogConfig = new MatDialogConfig();
  //   dialogConfig.panelClass = 'mid-pop';
  //   dialogConfig.data = { data: data, newData: valueByOnType };
  //   let dialogRef: MatDialogRef<LocationtypeAddEditComponent>;
  //   dialogRef = this.dialog.open(LocationtypeAddEditComponent, dialogConfig);
  //   return dialogRef.afterClosed();
  // }
  // End:all about location Type

  // start : all about Location Level Type
  // Start: Get Location Level  For Ng Select
  public getLocationLevelList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/drpdwnlocation/?colname=LocationLevel&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.LocationLevelList = data.result;
          this.LocationLevelListBK = data.result;
        }
        if (isSelectionRequired != 0) {
          this.addModuleForm.controls['locationLevel'].setValue(this.SelectedLocationLevelValue);
        }
        this.LocationLevelList = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get location Type  For Ng Select
  // start: On Ng Select Change Add Value
  public onLocationLevelChange(event) {
    if (typeof (event.id) != "undefined") {
      this.LocationLevelList = [];
      this.tempObj = {
        id: event.id,
        text: event.text
      };
      this.LocationLevelList = this.LocationLevelListBK;
      this.LocationLevelList.push(this.tempObj);
      this.addModuleForm.controls['locationLevel'].setValue(event.id);
    } else {
      this.addLocationLevel(event.text);
    }
  }
  // end : On Ng Select Change Add Value
  addLocationLevel(data) {
    this.dialogsService.locationLevelDialog([], data).subscribe(res => {
      if (res) {
        this.SelectedLocationLevelValue = res.result;
      }
      this.getLocationLevelList(1);
    }
    );
  }
  // public locationLevelDialog(data: any = [], valueByOnType: string = null): Observable<any> {
  //   var dialogConfig = new MatDialogConfig();
  //   dialogConfig.panelClass = 'mid-pop';
  //   dialogConfig.data = { data: data, newData: valueByOnType };
  //   let dialogRef: MatDialogRef<LocationLevelAddEditComponent>;
  //   dialogRef = this.dialog.open(LocationLevelAddEditComponent, dialogConfig);
  //   return dialogRef.afterClosed();
  // }
  // End : all about Location Level Type
  clear() {
    this.sellingRuleList = this.sellingRuleListBk;
  }
  doManage() {
    if (this.editData.length) {
      this.isbtnLoaderShow = true;
      this.btnUpdateTxt = "Please Wait..";
      // if (this.addModuleForm.invalid) {
      //   this.addModuleForm.controls.departmentName.markAsTouched();
      //   this.addModuleForm.controls.departmentNumber.markAsTouched();
      //   this.btnUpdateTxt = "Update";
      //   this.isbtnLoaderShow = false;
      //   return;
      // }
      this.pushAllIdInArray(this.editData)
      this.updateValue.data = this.addModuleForm.value;
      this.updateValue.nacs = this.dataSource.data;
      this.updateValue.previous = this.updateData;
      this._helper.apiPut(this.updateValue, this.moduleAPI).subscribe(
        res => {
          this._helper.notify({ message: res.message, messageType: res.status });
          if (res.status == 1) {
            this.submitted = false;
            this.resetForm(this.formGroupDirective, this.addModuleForm, "validateForm");
            this.isbtnLoaderShow = false;
            // this._dialogRef.close(true);
            this.getCommonData.emit({ openSidebar: false, dataAdded: true, hitListAction: 'editSuccess', noSelectionCheck: true });
          }
          this.btnUpdateTxt = "Update";
          this.isbtnLoaderShow = false;
        },
        error => {
          console.log('error', error);
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
        postValue.nacs = this.dataSource.data;
        this._helper.apiPost(postValue, this.moduleAPI).subscribe(
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
        // this._helper.thisDb().brands().find({ BrandName: myThis.addModuleForm.value.BrandName }, function (err, data) {
        //   myThis.btnCreateTxt = "Create";
        //   myThis.isbtnLoaderShow = false;
        //   if (!data.length) {
        //     myThis._helper.thisDb().brands().insert(myThis.addModuleForm.value, function (err, data) {
        //       // console.log('insert', data);
        //       this.getCommonData.emit({ openSidebar: false, dataAdded: this.addModuleForm.value });
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
  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
}
