import { DialogsService } from '../../../../services/dialogs.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
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
  selector: 'app-site-manage',
  templateUrl: './site-manage.component.html',
  styleUrls: ['./site-manage.component.scss']
})
export class SiteManageComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() pageData: PageData;
  @Output() getCommonData = new EventEmitter<{}>();

  moduleName: string = 'Site';
  displayModuleName: string = 'Site';
  moduleAPI: string = 'itemapis/site/';
  moduleLink: string = 'admin-mode/site';
  myForm: FormGroup;
  mfgList: any = [];
  submitted: boolean = false;
  BrandsList: any[];
  message: string;
  editData: any = [];
  dialogTitle: string = "Add New Pos Department";
  isDisabled: boolean = false;
  btnCreateTxt: string = "Create";
  btnUpdateTxt: string = "Update";
  BrandNameDropDownList: any = [];
  brandnameLoading: boolean = false;
  response: any;
  _source: any = {};
  tempObj: any;
  tag: boolean;
  SearchField: any = ['BrandName', 'Manufacturer', 'Description'];
  public dataSource = new MatTableDataSource<PeriodicElement>();
  isSelectBox: boolean = false;
  isbtnLoaderShow = false;
  IsAnotherChecked: boolean = false;
  isOnline: boolean = true;
  receivedData: any;
  isOpenSidebar: boolean = false;
  processMode: { id: string; text: string; }[];
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
  TobeselectedValue: any;
  timeZone: any;
  businessUnitList: any;
  retailSiteTypeCode: any;
  locationList: any;
  showTypeCodeRelatedField: boolean;
  operatingParty: any;
  operatingPartyBk: any;
  SelectedOperationPartyValue: any;
  siteType: any;
  siteTypeBk: any;
  SelectedValue: any;
  businessGroup: any;
  businessGroupBk: any;

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
    this.myForm = this._formBuilder.group({
      siteId: ['', Validators.required],
      timeZone: [null],
      siteType: [null],
      retailSiteType: [null],
      siteNorthAngleOffsetDegree: [null, [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
      location: [''],
      operationParty: [null],
      businessUnit: [''],
    });
  }
  get f() {
    return this.myForm.controls;
  }

  onSelectBrandname(event) {
    if (typeof (event) != "undefined") {
      if (typeof (event._source.tag) == "undefined") {
        this.mfgList = [];
        this.tempObj = {
          id: event._source.Manufacturer_ManufacturerName,
          text: event._source.Manufacturer_ManufacturerName
        };
        this.mfgList.push(this.tempObj);
        this.myForm.controls['Manufacturer'].setValue(event._source.Manufacturer_ManufacturerName);
        this.myForm.controls['Description'].setValue(event._source.Description);
      } else {
        this.myForm.controls['Manufacturer'].setValue(null);
        this.myForm.controls['Description'].setValue(null);
      }
    } else {
      this.myForm.controls['Manufacturer'].setValue(null);
      this.myForm.controls['Description'].setValue(null);
    }
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
      this.dialogTitle = "Add Site";
      this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
    }
  }

  ngOnInit() {
    this.dropDownData();
  }
  public getForupdateData(pageData) {
    this.editData = pageData;
    if (this.editData.length) {
      this.dialogTitle = "UpdateSite";
      const departmentName = this.myForm.get('departmentName');
      const departmentNumber = this.myForm.get('departmentNumber');
      if (this.editData.length == 1) {
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/retrievesite/`).subscribe(data => {
          this.updateData = data.data;
          departmentName.setValidators([Validators.required]);
          departmentNumber.setValidators([Validators.maxLength(10)]);
          this.setCommonDataInForm();
          departmentName.patchValue(this.updateData.departmentName);
          departmentNumber.patchValue(this.updateData.departmentNumber);
          if (data.nacs.length && data.nacs.length != 0) {
            this.dataSource.data = [];
            this.dataSource.data = data.nacs as PeriodicElement[];
          }
        });
      }
      else {
        departmentName.clearValidators();
        departmentNumber.clearValidators();
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/retrievesite/`).subscribe(data => {
          this.updateData = data.data;
          this.setCommonDataInForm();
          if (data.nacs.length && data.nacs.length != 0) {
            this.dataSource.data = [];
            this.dataSource.data = data.nacs as PeriodicElement[];
          }
        });
      }
    }
  }
  public setCommonDataInForm() {
    this.myForm.patchValue({
      parentDepartment: this.updateData.parentDepartmentID == null ? "" : this.updateData.parentDepartmentID,
      sellingRule: this.updateData.itemSellingRuleID == null ? "" : this.updateData.itemSellingRuleID,
      descripition: this.updateData.descripition == null ? "" : this.updateData.descripition,
      store: this.updateData.store == null ? "" : this.updateData.storeid,
    });
  }
  public pushAllIdInArray(allId) {
    this.updateValue.id = [];
    for (let edit of allId) {
      this.updateValue.id.push(edit.id);
    }
  }

  //start:dropdown Data List
  public dropDownData() {

    this._helper.apiGet('itemapis/drpsite/?colname=Timezone&').subscribe(
      data => {
        this.timeZone = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/drpsite/?colname=BusinessUnit&').subscribe(
      data => {
        this.businessUnitList = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/drpsite/?colname=RetailSiteTypeCode&').subscribe(
      data => {
        this.retailSiteTypeCode = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/drpsite/?colname=Location&').subscribe(
      data => {
        this.locationList = data.result;
      },
      error => console.log(error)
    );
    this.getSiteTypeList();
    this.getOperationPartyList();
  }
  //end:dropdown Data List
  public onTypeCodechange(event) {
    if (event == 1) {
      this.showTypeCodeRelatedField = false;
    }
    else {
      this.showTypeCodeRelatedField = true;
    }
  }

  // this.myForm.get('mySelectControl').valueChanges.subscribe(value => {

  // });

  // Start: Get Operation Party  For Ng Select
  public getOperationPartyList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/businessunitdrp/?colname=OperatingParty&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.operatingParty = data.result;
          this.operatingPartyBk = this.operatingParty;
        }
        if (isSelectionRequired != 0) {
          this.myForm.controls['operationParty'].setValue(this.SelectedOperationPartyValue);
        }
        this.operatingParty = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get Operation Party  For Ng Select

  // Start: Get BusinessGroup  For Ng Select
  public getSiteTypeList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/drpsite/?colname=SiteType&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.siteType = data.result;
          this.siteTypeBk = this.siteType;
        }
        if (isSelectionRequired != 0) {
          this.myForm.controls['siteType'].setValue(this.SelectedValue);
        }
        this.siteType = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get BusinessGroup  For Ng Select



  // start: On Ng Select Change Add Value
  public onSiteTypeChange(event) {
    if (typeof (event.id) != "undefined") {
      this.siteType = [];
      this.tempObj = {
        id: event.id,
        text: event.text
      };
      this.siteType = this.siteTypeBk;
      this.siteType.push(this.tempObj);
      this.myForm.controls['siteType'].setValue(event.id);
    } else {
      this.addSiteType(event.text);
    }
  }
  // end : On Ng Select Change Add Value


  //start: open dialog
  addSiteType(data) {
    this.dialogsService.siteTypeDialog([], data).subscribe(res => {
      if (res) {
        this.SelectedValue = res.result;
      }
      this.getSiteTypeList(1);
    }
    );
  }
  // public siteTypeDialog(data: any = [], valueByOnType: string = null): Observable<any> {
  // 	var dialogConfig = new MatDialogConfig();
  // 	dialogConfig.panelClass = 'mid-pop';
  // 	dialogConfig.data = { data: data, newData: valueByOnType };
  // 	let dialogRef: MatDialogRef<SiteTypeAddEditComponent>;
  // 	dialogRef = this.dialog.open(SiteTypeAddEditComponent, dialogConfig);
  // 	return dialogRef.afterClosed();
  // }
  //end: open dialog



  public clear() {
    this.businessGroup = this.businessGroupBk;
  }



  doManage() {
    if (this.editData.length) {
      this.isbtnLoaderShow = true;
      this.btnUpdateTxt = "Please Wait..";
      this.pushAllIdInArray(this.editData)
      this.updateValue.data = this.myForm.value;
      this.updateValue.nacs = this.dataSource.data;
      this.updateValue.previous = this.updateData;
      this._helper.apiPut(this.updateValue, `itemapis/retrievesite/`).subscribe(
        res => {
          this._helper.notify({ message: res.message, messageType: res.status });
          if (res.status == 1) {
            this.submitted = false;
            this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
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
      if (this.myForm.invalid) {
        this.btnCreateTxt = "Create";
        this.isDisabled = false;
        return;
      }
      this.isbtnLoaderShow = true;
      if (this.isOnline) {
        var postValue = this.myForm.value;
        postValue.nacs = this.dataSource.data;
        this._helper.apiPost(postValue, this.moduleAPI).subscribe(
          res => {
            if (res.message) {
              this._helper.notify({ message: res.message, messageType: res.status });
            }
            if (res.status == 1) {
              this.submitted = false;
              this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
              this.isbtnLoaderShow = false;
              if (this.IsAnotherChecked == true) {
                this.submitted = false;
                this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
                this.isbtnLoaderShow = false;
              } else {
                this.getCommonData.emit({ openSidebar: false, dataAdded: this.myForm.value });
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




}
