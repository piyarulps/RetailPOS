import { DialogsService } from '.././../../../services/dialogs.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatDatepicker } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ElasticsearchService } from '../../../../services/elasticsearch.service';
import { HelperService } from '../../../../services/helper.service';
import { ConnectionService } from 'ng-connection-service';
import { MatInput } from '@angular/material/input';
import { NgSelectComponent } from '@ng-select/ng-select';
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
  selector: 'app-businessunit-manage',
  templateUrl: './businessunit-manage.component.html',
  styleUrls: ['./businessunit-manage.component.scss']
})
export class BusinessunitManageComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() pageData: PageData;
  @Output() getCommonData = new EventEmitter<{}>();
  @ViewChild('brandNameInput') brandNameInputField: MatInput;
  @ViewChild('brandNameSelect') brandNameSelectField: NgSelectComponent;

  moduleName: string = 'Business Unit';
  displayModuleName: string = 'Business Unit';
  moduleAPI: string = 'itemapis/businessunit/';
  moduleLink: string = 'admin-mode/businessunit';
  myForm: FormGroup;
  mfgList: any = [];
  submitted: boolean = false;
  BrandsList: any[];
  message: string;
  editData: any = [];
  dialogTitle: string = "Add New Business Unit";
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
      name: ['', Validators.required],
      typeCode: [null],
      openDate: [''],
      closeDate: [''],
      size: ['', [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
      sellingAreaSize: ['', [Validators.min(0), Validators.max(99999999999), Validators.pattern(/^\d{1,11}(\.\d{1,5})?$/)]],
      lastremodeldate: [''],
      localcurrency: [''],
      isoCurrency: [''],
      status: ['n'],
      operationParty: [null],
      businessGroup: [null],
      businessSite: ['']
    });
  }
  get f() {
    return this.myForm.controls;
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
      this.dialogTitle = "Add  Business Unit";
      this.resetForm(this.formGroupDirective, this.myForm, "validateForm");
    }
  }

  ngOnInit() {
    this.dropDownData();
  }

  public getForupdateData(pageData) {
    this.editData = pageData;
    if (this.editData.length) {
      this.dialogTitle = "Update Business Unit";
      const name = this.myForm.get('name');
      const typeCode = this.myForm.get('typeCode');
      if (this.editData.length == 1) {
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/commonbusinessunit/`).subscribe(data => {
          this.updateData = data.data;
          name.setValidators([Validators.required]);
          this.setCommonDataInForm();
          name.patchValue(this.updateData.BusinessUnitName);
          this.checkTypeCode = true;
          if (this.myForm.value.typeCode == 1) {
            this.showTypeCodeRelatedField = false;
          }
          else {
            this.showTypeCodeRelatedField = true;
          }
        });
      }
      else {
        name.clearValidators();
        typeCode.clearValidators();
        this.pushAllIdInArray(this.editData)
        this._helper.apiPost(this.updateValue.id, `itemapis/commonbusinessunit/`).subscribe(data => {
          this.updateData = data.data;
          this.setCommonDataInForm();
          this.checkTypeCode = true;
          if (this.myForm.value.typeCode == 1) {
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
    this.myForm.patchValue({
      typeCode: this.updateData.TypeCode == null ? "" : parseInt(this.updateData.TypeCode),
      size: this.updateData.Size == null ? "" : this.updateData.Size,
      openDate: this.updateData.OpenDate == null ? "" : this.updateData.OpenDate,
      closeDate: this.updateData.ClosingDate == null ? "" : this.updateData.ClosingDate,
      sellingAreaSize: this.updateData.SellingAreaSize == null ? "" : this.updateData.SellingAreaSize,
      lastremodeldate: this.updateData.LastRemodelDate == null ? "" : this.updateData.LastRemodelDate,
      isoCurrency: this.updateData.ISOCurrencyCode == null ? "" : this.updateData.ISOCurrencyCode,
      localcurrency: this.updateData.Local == null ? "" : this.updateData.Local,
      status: this.updateData.isblocked == null ? "" : this.updateData.isblocked,
      operationParty: this.updateData.OperationalPartyID == null ? "" : this.updateData.OperationalPartyID,
      businessGroup: this.updateData.BusinessUnitGroupID == null ? "" : this.updateData.BusinessUnitGroupID,
      businessSite: this.updateData.siteID == null ? "" : this.updateData.siteID,
    });
  }
  public pushAllIdInArray(allId) {
    this.updateValue.id = [];
    for (let edit of allId) {
      this.updateValue.id.push(edit.id);
    }
  }

  public dropDownData() {
    this._helper.apiGet('itemapis/businessunitdrp/?colname=TypeCode&').subscribe(
      data => {
        this.typeCode = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/businessunitdrp/?colname=LocalCurrency&').subscribe(
      data => {
        this.localCurrency = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/businessunitdrp/?colname=ISOCurrency&').subscribe(
      data => {
        this.ISOCurrency = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/businessunitdrp/?colname=CurrencyType&').subscribe(
      data => {
        this.currencyType = data.result;
      },
      error => console.log(error)
    );
    this._helper.apiGet('itemapis/businessunitdrp/?colname=BusinessSite&').subscribe(
      data => {
        this.businessSite = data.result;
      },
      error => console.log(error)
    );
    this.getBusinessList();
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
  public getBusinessList(isSelectionRequired: number = 0) {
    this._helper.apiGet('itemapis/businessunitdrp/?colname=BusinessGroup&').subscribe(
      data => {
        if (data["status"] == 1) {
          this.businessGroup = data.result;
          this.businessGroupBk = this.businessGroup;
        }
        if (isSelectionRequired != 0) {
          this.myForm.controls['businessGroup'].setValue(this.SelectedValue);
        }
        this.businessGroup = data.result;
      },
      error => console.log(error)
    );
  }
  // End: Get BusinessGroup  For Ng Select

  // start: On Ng Select Change Add Value
  public onOperationPartyChange(event) {
    if (typeof (event.id) != "undefined") {
      this.operatingParty = [];
      this.tempObj = {
        id: event.id,
        text: event.text
      };
      this.operatingParty = this.operatingPartyBk;
      this.operatingParty.push(this.tempObj);
      this.myForm.controls['operationParty'].setValue(event.id);
    } else {
      this.addOperationParty(event.text);
    }
  }
  // end : On Ng Select Change Add Value

  // start: On Ng Select Change Add Value
  public onBusinessGroupChange(event) {
    if (typeof (event.id) != "undefined") {
      this.businessGroup = [];
      this.tempObj = {
        id: event.id,
        text: event.text
      };
      this.businessGroup = this.businessGroupBk;
      this.businessGroup.push(this.tempObj);
      this.myForm.controls['businessGroup'].setValue(event.id);
    } else {
      this.addBusinessGroup(event.text);
    }
  }
  // end : On Ng Select Change Add Value

  //start: open dialog
  addBusinessGroup(data) {
    this.dialogsService.businessGroupDialog([], data).subscribe(res => {
      if (res) {
        this.SelectedValue = res.result;
      }
      this.getBusinessList(1);
    }
    );
  }
  //end: open dialog

  addOperationParty(data) {
    this.dialogsService.operationPartyDialog([], data).subscribe(res => {
      if (res) {
        this.SelectedOperationPartyValue = res.result;
      }
      this.getOperationPartyList(1);
    }
    );
  }
  clear() {
    this.sellingRuleList = this.sellingRuleListBk;
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
      this.updateValue.data = this.myForm.value;
      this.updateValue.nacs = this.dataSource.data;
      this.updateValue.previous = this.updateData;
      this._helper.apiPut(this.updateValue, this.moduleAPI).subscribe(
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
  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
}
