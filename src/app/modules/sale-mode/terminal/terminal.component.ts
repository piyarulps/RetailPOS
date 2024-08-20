import { Component, OnInit, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { Globals } from '../../../globals';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ConnectionService } from 'ng-connection-service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomerManageComponent } from '../dialogs/customer-manage/customer-manage.component';

declare function scannerStatus(params: any): void;

export interface CartDetails {
    itemCount: number;
    subtotal: number;
    discount: number;
    salesTax: number;
    total: number;
    payments: number;
    balance: number;
    change: number;
}

@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, OnDestroy {

    @ViewChild('barcodeInput') barcodeInputField: ElementRef;
    @ViewChild('custNameSearchInput') custNameSearchInputField: ElementRef;
    @ViewChild('saleAmountInput') saleAmountInputField: ElementRef;
    cartDetails: CartDetails;
    private searchTextChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 500;

    terminalData: any = {};
    devices: any = [];
    userDevices: any = {};
    currentUser: any = {};
    signOnData: any = {};
    userName: string = '';
    workStationId: number = 0;
    locationName: string = 'Terminal';
    defaultCurrency: string = '';
    rippleColor: string = 'rgba(255,255,255,.3)';
    today: any = new Date();
    isOnline: boolean = false;
    numberSet: any = ['0', '00', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    actionSet: any = ['clear', 'qty', 'enter'];
    arrowsKeyCodeSet: any = [37, 38, 39, 40];
    activeElementModel: any = '';
    activeElementType: any = '';
    activeElementReference: any = '';
    defaultView: string = 'main';
    defaultInputView: string = 'product';
    activeView: string = this.defaultView;
    activeInputView: string = this.defaultInputView;
    isLookupEnable: boolean = false;
    barcodeText: any = {
        focus: 'Scan Product',
        blur: 'Tap here & scan product'
    }

    barcode: any = {
        code: '',
        price: '0.00'
    };
    barcodeInputHasFocus: boolean = false;
    scanWithQty: any = {
        isQtySet: false,
        qty: 0
    }
    showBarcodeLoader: boolean = false;
    barcodeSearchData: any = [];
    searchTimeout: any;
    resetScanTimeout: any;
    cartItems: any = [];
    activeCartItemIndex: any = null;
    activeSearchDataIndex: any = null;
    custNameSearch: any = '';
    custNameSearchInputHasFocus: boolean = false;
    custNameSearchLoader: boolean = false;
    custNameSearchData: any = [];
    customer: any = {
        name: 'NA',
        phone: '',
        point: 0,
        id: null
    };
    saleAmountInputHasFocus: boolean = false;
    saleCashAmount: any = '';
    paymentMode: string = 'cash';
    itemFetchMethod: string = 'scan';
    itemScannedCount: number = 0;
    itemKeyedCount: number = 0;
    lockElapsedTime: number = 0;
    lockedTime: Date = null;
    unlockedTime: Date = null;
    retailLogIsCompleted: number = 0;
    ringElapsedTime: number = 0;
    tenderElapsedTime: number = 0;
    idleElapsedTime: number = 0;
    ringStartTime: Date = null;
    ringEndTime: Date = null;
    idleStartTime: Date = null;
    idleEndTime: Date = null;
    saleStartTime: string = null;
    saleEndTime: string = null;
    tenderStartTime: string = null;
    tenderEndTime: string = null;
    currentTransactionMode: string = 'sale';
    openingBalance: number = 0;
    denominationList: any = [];
    denominationListLength: number = 14;
    denominationRecord: any = {};
    hasDenominationRecord: boolean = false;
    wholeSalesIsCanceled: number = 0;
    wholeSalesIsVoid: number = 0;
    saleActivitySequence: number = 1;
    isAddTender: boolean = false;

    constructor(
        public _connectionService: ConnectionService,
        public _helper: HelperService,
        public _hotkeysService: HotkeysService,
        public _globals: Globals,
        public _decimalPipe: DecimalPipe,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _dialog: MatDialog
    ) {
        this._connectionService.monitor().subscribe(isConnected => {
            this.isOnline = isConnected;
            console.log('App online status', this.isOnline);
        });
        this._hotkeysService.add(new Hotkey(this._globals.SKEY_UP, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false;
            this.upDownEvent('up');
            return e;
        }, ['INPUT', 'TEXTAREA', 'SELECT']));
        this._hotkeysService.add(new Hotkey(this._globals.SKEY_DOWN, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false;
            this.upDownEvent('down');
            return e;
        }, ['INPUT', 'TEXTAREA', 'SELECT']));
        this._hotkeysService.add(new Hotkey(this._globals.SKEY_DEL, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false;
            this.removeItem();
            return e;
        }, ['INPUT', 'TEXTAREA', 'SELECT']));
    }

    logout() {
        this._authenticationService.logout();
        this._router.navigate(['/login']);
    }

    lock() {
        this.lockedTime = new Date();
        this._helper.apiGetLocal('pos-lock/').subscribe(
            res => {
                // console.log('lock res', res);
            },
            error => console.log('error', error)
        );
        this.currentUser.isLocked = true;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this._router.navigate(['/dashboard']);
    }

    connectScanner() {
        this._helper.apiGetLocal('connected_devices').subscribe(
            res => {
                if (res.status == 1) {
                    let data: any = res.data;
                    let serialNumbers: any = [];
                    data.forEach(
                        (value, key) => {
                            if (!serialNumbers.includes(value.serialNumber) && value.serialNumber != '' && typeof value.serialNumber != 'undefined') {
                                serialNumbers.push(value.serialNumber);
                                this.devices.push(data[key]);
                            }
                        });
                }
                else if (res.message) {
                    this._helper.notify({ message: res.message, messageType: res.status });
                }
            },
            error => console.log('error', error)
        );
    }

    addCustomer() {
        let name: string = '';
        if (typeof this.custNameSearch != 'undefined' && this.custNameSearch.length) {
            name = this.custNameSearch;
        }
        this.manageCustomer({ name: name }).subscribe(
            res => {
                console.log('res', res);
            },
            error => console.log('error', error)
        );
    }

    manageCustomer(preSetData?: any): Observable<any> {
        var dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'add-pop';
        dialogConfig.data = { preSetData: preSetData };
        let dialogRef: MatDialogRef<CustomerManageComponent>;
        dialogRef = this._dialog.open(CustomerManageComponent, dialogConfig);
        dialogRef.disableClose = true;
        return dialogRef.afterClosed();
    }

    // DOM related functions start
    resetDenomination() {
        this.denominationRecord = {};
        this.denominationList.forEach(element => {
            if (typeof element.id != 'undefined') {
                this.denominationRecord[element.id] = {
                    id: element.id,
                    amount: element.MonetaryValueAmount,
                    count: 0
                }
            }
        });
        // console.log('resetDenomination denominationList', this.denominationList);
        // console.log('resetDenomination denominationRecord', this.denominationRecord);
    }

    setSaleCashAmount(value, id) {
        this.hasDenominationRecord = true;
        let temp = this.getCashAmount();
        this.saleCashAmount = temp + parseFloat(value);
        // console.log('setSaleCashAmount denominationRecord[id]', this.denominationRecord[id]);
        this.denominationRecord[id].count++;
        // console.log('setSaleCashAmount denominationRecord', this.denominationRecord);
        this.updateCalculation();
    }

    manageView(view: string, inputView?: string) {
        let now: any = this._helper.getCurrentDateTime();
        if (view) {
            if (this.activeView == view) {
                this.activeView = this.defaultView;
            }
            else {
                this.activeView = view;
            }
            setTimeout(() => {
                switch (this.activeView) {
                    case 'cash': {
                        this.saleCashAmount = this.barcode.code == '' ? this.saleCashAmount : this.barcode.code;
                        this.barcode.code = '';
                        this.saleEndTime = now.dateTime;
                        this.tenderStartTime = now.dateTime;
                        this.currentTransactionMode = 'tender';
                        this.chooseAmount();
                    }
                        break;
                    default: {
                        console.log('DEFAULT activeView', this.activeView);
                    }
                        break;
                }
            }, 100);
        }
        else {
            this.activeView = this.defaultView;
        }
        if (inputView) {
            this.activeSearchDataIndex = null;
            if (this.activeInputView == inputView) {
                this.activeInputView = this.defaultInputView;
            }
            else {
                this.activeInputView = inputView;
            }
            setTimeout(() => {
                switch (this.activeInputView) {
                    case 'product': {
                        this.barcodeInputHasFocus = true;
                        this.barcodeInputField.nativeElement.focus();
                        this.setInputElement('barcode.code', 'string', 'barcode');
                    }
                        break;
                    case 'customer': {
                        this.custNameSearchInputHasFocus = true;
                        this.custNameSearchInputField.nativeElement.focus();
                        this.setInputElement('custNameSearch', 'string', 'customerNameSearch');
                    }
                        break;
                    case 'amount': {
                        this.saleAmountInputHasFocus = true;
                        this.saleAmountInputField.nativeElement.focus();
                        this.setInputElement('saleCashAmount', 'decimal', 'saleAmount');
                    }
                        break;
                    default: {
                        console.log('DEFAULT activeInputView', this.activeInputView);
                    }
                        break;
                }
            }, 100);
        }
        else {
            this.activeInputView = this.defaultInputView;
        }
        setTimeout(() => {
            console.log('activeView', this.activeView, 'activeInputView', this.activeInputView);
        }, 1000);
        this.updateCalculation();
    }

    manageEnterHit(params: any = { resetCartIndex: false }) {
        if (this.activeInputView == 'product') {
            if (this.barcodeInputHasFocus && this.isLookupEnable) {
                this.chooseUPC();
            }
            else if (this.barcodeInputHasFocus) {
                this.scanUPC(this.barcode.code, true);
            }
        }
        else if (this.activeInputView == 'customer') {
            this.chooseCustomer();
        }
        else if (this.activeInputView == 'amount') {
            this.chooseAmount(true);
        }
        if (params.resetCartIndex) {
            this.activeCartItemIndex = null;
            if (this.activeInputView == 'product') {
                this.barcodeInputField.nativeElement.focus();
            }
            else if (this.activeInputView == 'customer') {
                this.custNameSearchInputField.nativeElement.focus();
            }
            else if (this.activeInputView == 'amount') {
                this.saleAmountInputField.nativeElement.focus();
            }
        }
    }

    manageLookup() {
        this.resetScan({ resetBarcode: false, resetQty: false });
        this.isLookupEnable = !this.isLookupEnable;
        if (this.isLookupEnable) {
            this.initSearchCustom();
        }
        this.setPlaceholderText();
    }

    setPlaceholderText(): void {
        if (this.activeView == 'main') {
            if (this.isLookupEnable) {
                this.barcodeText = {
                    focus: 'Search Product',
                    blur: 'Tap here & search product'
                }
            }
            else {
                this.barcodeText = {
                    focus: 'Scan Product',
                    blur: 'Tap here & scan product'
                }
            }
        }
        // else if (this.activeView == 'cash') {
        // 	this.barcodeText = {
        // 		focus: 'Enter Amount',
        // 		blur: 'Tap here & enter amount'
        // 	}
        // }
    }

    initSearch(event) {
        if (typeof event.keyCode != 'undefined' && !this.arrowsKeyCodeSet.includes(event.keyCode)) {
            if (this.activeInputView == 'product' && this.isLookupEnable) {
                this.searchTextChanged.next(this.barcode.code);
            }
            else if (this.activeInputView == 'customer') {
                this.searchTextChanged.next(this.custNameSearch);
            }
        }
    }

    initSearchCustom() {
        clearTimeout(this.searchTimeout);
        if (this.activeInputView == 'product' && this.isLookupEnable) {
            this.searchTimeout = setTimeout(() => {
                this.search();
            }, 500);
        }
        else if (this.activeInputView == 'customer') {
            this.searchTimeout = setTimeout(() => {
                this.searchCustomer();
            }, 500);
        }
    }

    ignoreFocus(event) {
        // console.log('ignoreFocus event', event);
        event.stopImmediatePropagation();
        event.preventDefault();
    }

    setScanWithQty() {
        if (this.activeInputView == this.defaultInputView) {
            this.barcodeInputHasFocus = true;
            this.barcodeInputField.nativeElement.focus();
            this.setInputElement('barcode.code', 'string', 'barcode');
            if (this.scanWithQty.isQtySet) {
                this.scanWithQty = {
                    isQtySet: false,
                    qty: 0
                };
                this._helper.notify({ message: `Qty reset to: 1` });
            }
            else {
                if (parseInt(this.barcode.code)) {
                    this.scanWithQty = {
                        isQtySet: true,
                        qty: parseInt(this.barcode.code)
                    };
                    this.barcode = {
                        code: '',
                        price: this.barcode.price
                    }
                    this._helper.notify({ message: `Qty set to: ${this.scanWithQty.qty}` });
                }
                else {
                    this._helper.notify({ message: `Enter valid Qty`, messageType: 0 });
                }
            }
        }
        else {
            this._helper.notify({ message: `Switch to Product Scan mode to avail X/Qty option.`, messageType: 0 });
        }
    }

    upDownEvent(way: string) {
        if ((this.barcodeSearchData.length && this.barcodeInputHasFocus && this.activeInputView == 'product') || (this.custNameSearchData.length && this.custNameSearchInputHasFocus && this.activeInputView == 'customer')) {
            this.changeSearchDataIndex(way);
        }
        else if (this.cartItems.length) {
            this.changeCartItemIndex(way);
        }
    }

    changeSearchDataIndex(way: string): void {
        // if (this.barcodeSearchData.length) {
        let temp: any = [];
        if (this.activeInputView == 'product') {
            temp = this.barcodeSearchData;
        }
        else if (this.activeInputView == 'customer') {
            temp = this.custNameSearchData;
        }
        if (this.activeSearchDataIndex != null) {
            let currentIndex: number = parseInt(this.activeSearchDataIndex);
            let nextIndex: number = currentIndex + 1;
            let prevIndex: number = currentIndex - 1;
            if (way == 'down' && typeof temp[nextIndex] != 'undefined') {
                this.activeSearchDataIndex = nextIndex.toString();
            }
            else if (way == 'up' && typeof temp[prevIndex] != 'undefined') {
                this.activeSearchDataIndex = prevIndex.toString();
            }
        }
        else {
            if (way == 'down' || temp.length == 1) {
                this.activeSearchDataIndex = '0';
            }
            else if (way == 'up') {
                this.activeSearchDataIndex = (temp.length - 1).toString();
            }
        }
        // }
    }

    changeCartItemIndex(way: string): void {
        if (this.cartItems.length) {
            if (this.activeCartItemIndex != null) {
                let currentIndex: number = parseInt(this.activeCartItemIndex);
                let nextIndex: number = currentIndex + 1;
                let prevIndex: number = currentIndex - 1;
                if (way == 'up' && typeof this.cartItems[nextIndex] != 'undefined') {
                    this.activeCartItemIndex = nextIndex.toString();
                }
                else if (way == 'down' && typeof this.cartItems[prevIndex] != 'undefined') {
                    this.activeCartItemIndex = prevIndex.toString();
                }
            }
            else {
                if (way == 'up' || this.cartItems.length == 1) {
                    this.activeCartItemIndex = '0';
                }
                else if (way == 'down') {
                    this.activeCartItemIndex = (this.cartItems.length - 1).toString();
                }
            }
            this.barcodeInputField.nativeElement.blur();
            this.barcodeInputHasFocus = false;
            this.setInputElement(this.activeCartItemIndex, 'number', 'itemQty');
        }
    }

    cartItemIndex(cartRow, isSet: boolean) {
        // console.log('cartRow data-cart-item-index', cartRow.getAttribute('data-cart-item-index'));
        if (isSet) {
            if (this.activeCartItemIndex == cartRow.getAttribute('data-cart-item-index')) {
                this.activeCartItemIndex = null;
            }
            else {
                this.activeCartItemIndex = cartRow.getAttribute('data-cart-item-index');
            }
        }
        else {
            this.activeCartItemIndex = null;
        }
        if (this.activeCartItemIndex != null) {
            this.setInputElement(this.activeCartItemIndex, 'number', 'itemQty');
        }
        else {
            this.setInputElement('', '', '');
        }
        // console.log('this.activeCartItemIndex', this.activeCartItemIndex);
    }

    // Note: elementModel will only work if model name is in string format. [oneModel: valid, anotherModel.child: invalid]
    setInputElement(elementModel: string, elementType: string, elementReference: string = ''): void {
        this.activeElementModel = elementModel;
        this.activeElementType = elementType;
        this.activeElementReference = elementReference;
        // console.log(this.activeElementModel, this.activeElementType, this.activeElementReference);
        // return false;
    }

    terminalKeypad(value) {
        // console.log(this.activeElementModel, this.activeElementType, this.activeElementReference);
        if (this.numberSet.includes(value) && this.activeElementType == 'number') {
            if (this.activeElementReference == 'itemQty') {
                let temp: any = this.cartItems[this.activeElementModel].ItemQty.toString();
                temp += value;
                this.cartItems[this.activeElementModel].ItemQty = parseInt(temp);
                this.updateCalculation();
            }
            else {
                let temp: any = this[this.activeElementModel].toString();
                temp += value;
                this[this.activeElementModel] = parseInt(temp);
            }
        }
        else if ((this.numberSet.includes(value) || value == '.') && this.activeElementType == 'decimal') {
            let temp: any = this[this.activeElementModel].toString();
            temp += value;
            this[this.activeElementModel] = temp;
        }
        else if (this.actionSet.includes(value)) {
            // console.log('action');
            if (value == 'clear') {
                if (this.activeElementReference == 'itemQty') {
                    let temp: any = this.cartItems[this.activeElementModel].ItemQty.toString();
                    if (temp.length > 0) {
                        temp = temp.substr(0, temp.length - 1);
                        this.cartItems[this.activeElementModel].ItemQty = parseInt(temp) ? parseInt(temp) : '';
                        this.updateCalculation();
                    }
                }
                else if (this.activeElementReference == 'barcode') {
                    let temp: any = this.barcode.code.toString();
                    if (temp.length > 0) {
                        temp = temp.substr(0, temp.length - 1);
                        this.barcode.code = temp;
                    }
                    this.initSearchCustom();
                }
                // else if (this.activeElementReference == 'customerNameSearch') {
                else if (typeof this[this.activeElementModel] != 'undefined') {
                    if (this.activeElementReference == 'saleAmount') {
                        this[this.activeElementModel] = '';
                        this.updateCalculation();
                        this.resetDenomination();
                    }
                    else {
                        let temp: any = this[this.activeElementModel].toString();
                        if (temp.length > 0) {
                            temp = temp.substr(0, temp.length - 1);
                            this[this.activeElementModel] = temp;
                        }
                        if (this.activeElementReference == 'customerNameSearch') {
                            this.initSearchCustom();
                        }
                    }
                }
            }
            if (value == 'enter') {
                // if (this.activeElementReference == 'barcode') {
                // 	this.scanUPC(this.barcode.code, true);
                // }
                this.manageEnterHit({ resetCartIndex: true });
            }
        }
        else if (this.activeElementType == 'string') {
            if (this.activeElementReference == 'barcode') {
                let temp: any = this.barcode.code.toString();
                temp += value;
                this.barcode.code = temp;
                this.initSearchCustom();
            }
            else if (typeof this[this.activeElementModel] != 'undefined') {
                let temp: any = this[this.activeElementModel].toString();
                temp += value;
                this[this.activeElementModel] = temp;
                if (this.activeElementReference == 'customerNameSearch') {
                    this.initSearchCustom();
                }
            }
        }
    }
    // DOM related functions end
    getCashAmount() {
        if (this.saleCashAmount == '') {
            return 0;
        }
        else if ((this._globals.REGEXP_DECIMAL.test(this.saleCashAmount) || this.saleCashAmount == 0) && (parseFloat(this.saleCashAmount) || parseFloat(this.saleCashAmount) == 0)) {
            let temp = (this._decimalPipe.transform(this.saleCashAmount, '1.2-2')).replace(/,/g, '');
            return parseFloat(temp);
        }
        else {
            if (this.activeInputView == 'amount') {
                // this._helper.notify({ message: 'Enter a valid amount.', messageType: 0 });
            }
            return 0;
        }
    }

    chooseAmount(didHitEnter = false) {
        if (this.paymentMode == 'cash') {
            this.updateCalculation();
            setTimeout(() => {
                let temp: number = this.getCashAmount();
                if (temp >= this.cartDetails.total && this.cartDetails.total > 0) {
                    if (didHitEnter) {
                        this.completeTender();
                    }
                }
            });
        }
    }

    completeTender() {
        let now: any = this._helper.getCurrentDateTime();
        this.tenderEndTime = now.dateTime;
        this.retailLogIsCompleted = 1;
        this.isAddTender = true;
        this.retailLog();
    }

    chooseCustomer(index?: number, isChooseCust?: boolean) {
        let temp: any = null;
        if (index) {
            temp = index;
        }
        else if (this.activeSearchDataIndex != null) {
            temp = this.activeSearchDataIndex;
        }
        if (temp != null && this.custNameSearchData.length && typeof this.custNameSearchData[temp] != 'undefined' && typeof this.custNameSearchData[temp].CustomerName != 'undefined') {
            this.customer = {
                name: this.custNameSearchData[temp].FirstName + ' ' + this.custNameSearchData[temp].LastName,
                phone: this.custNameSearchData[temp].PhoneNumber,
                point: this.custNameSearchData[temp].Points,
                id: this.custNameSearchData[temp].CustomerID
            }
        }
        // console.log('this.customer', this.customer);
        this.custNameSearchData = [];
        this.custNameSearch = '';
    }

    resetSale(isConfirm: boolean = true): void {
        if (isConfirm) {
            this._helper.confirmDialog({ message: `Do you want to cancel whole transaction?` }).subscribe(
                res => {
                    if (res) {
                        this.retailLogIsCompleted = 1;
                        this.wholeSalesIsCanceled = 1;
                        this.retailLog();
                        //this.reset();
                    }
                }
            );
        }
        else {
            this.reset();
        }
    }

    reset() {
        this.saleCashAmount = 0;
        this.resetScan();
        this.cartItems = [];
        this.activeCartItemIndex = null;
        this.updateCalculation();
        // this.activeView = this.defaultView;
        this.itemScannedCount = 0;
        this.itemKeyedCount = 0;
        this.lockElapsedTime = 0;
        this.lockedTime = null;
        this.unlockedTime = null;
        this.retailLogIsCompleted = 0;
        this.ringElapsedTime = 0;
        this.tenderElapsedTime = 0;
        this.idleElapsedTime = 0;
        this.ringStartTime = null;
        this.ringEndTime = null;
        this.saleStartTime = null;
        this.saleEndTime = null;
        this.tenderStartTime = null;
        this.tenderEndTime = null;
        this.currentTransactionMode = 'sale';
        this.customer = {
            name: 'NA',
            phone: '',
            point: 0,
            id: null
        };
        this.wholeSalesIsCanceled = 0;
        this.wholeSalesIsVoid = 0;
        this.saleActivitySequence = 1;
        this.isAddTender = false;
    }

    resetScan(params: any = { resetBarcode: true, resetQty: true }): void {
        if (params.resetBarcode) {
            this.barcode.code = '';
        }
        if (params.resetQty) {
            if (this.scanWithQty.isQtySet) {
                this._helper.notify({ message: `Qty reset to: 1` });
            }
            this.scanWithQty = {
                isQtySet: false,
                qty: 0
            };
        }
        this.barcode.price = 0;
        this.barcodeSearchData = [];
        this.manageView(this.defaultView, this.defaultInputView);
    }

    search() {
        this.activeSearchDataIndex = null;
        if (this.barcode.code.length) {
            this.showBarcodeLoader = true;
            // http://localhost:8500/itemlist/?q=aa&offset=1&limit=25&
            this._helper.apiGetLocal(`item_lookups/?q=${this.barcode.code}&`).subscribe(
                res => {
                    this.showBarcodeLoader = false;
                    if (res.status == 1) {
                        this.barcodeSearchData = res.result;
                        this.activeSearchDataIndex = '0';
                    }
                    else {
                        this.barcodeSearchData = [];
                        this.barcodeSearchData.push(
                            {
                                EmptyResult: 'No products found.'
                            }
                        );
                        this._helper.notify({ message: res.message, messageType: res.status });
                    }
                },
                error => {
                    this.showBarcodeLoader = false;
                    this.barcode = {
                        code: '',
                        price: '0.00'
                    };
                    console.log('error', error);
                }
            )
        }
        else {
            this.showBarcodeLoader = false;
            this.barcodeSearchData = [];
        }
    }

    searchCustomer() {
        this.activeSearchDataIndex = null;
        if (this.custNameSearch.length) {
            this.custNameSearchLoader = true;
            this._helper.apiGetLocal(`customer_lookups/?q=${this.custNameSearch}&`).subscribe(
                res => {
                    this.custNameSearchLoader = false;
                    if (res.status == 1) {
                        this.custNameSearchData = res.result;
                        this.activeSearchDataIndex = '0';
                    }
                    else {
                        this.custNameSearchData = [];
                        this.custNameSearchData.push(
                            {
                                EmptyResult: `Add Customer:&nbsp;<strong>${this.custNameSearch}</strong>`
                            }
                        );
                        this._helper.notify({ message: res.message, messageType: res.status });
                    }
                },
                error => {
                    this.custNameSearchLoader = false;
                    this.custNameSearch = '';
                    console.log('error', error);
                }
            )
        }
        else {
            this.custNameSearchLoader = false;
            this.custNameSearchData = [];
        }
    }

    removeItem(cartIndex?: number) {
        let index: number = null;
        if (cartIndex) {
            index = cartIndex;
        }
        else if (this.activeCartItemIndex) {
            index = this.activeCartItemIndex;
        }
        if (typeof index != 'undefined' && index != null && typeof this.cartItems[index] != 'undefined') {
            //this.cartItems.splice(index, 1);
            this.cartItems[index]['isShowable'] = false;
            let objTobeVoid: any = JSON.parse(JSON.stringify(this.cartItems[index]));
            this.cartItems.push(objTobeVoid);
            this.cartItems[this.cartItems.length - 1]['SequenceNumber'] = this.saleActivitySequence;
            this.cartItems[this.cartItems.length - 1]['VoidFlag'] = 1;
            this.saleActivitySequence++;
            this.activeCartItemIndex = null;
            this.updateCalculation();
            setTimeout(() => {
                this.retailLog();
            });
        }
        else {
            this._helper.confirmDialog({ message: `Do you want to void whole transaction?` }).subscribe(
                res => {
                    if (res) {
                        this.retailLogIsCompleted = 1;
                        this.wholeSalesIsVoid = 1;
                        this.activeCartItemIndex = null;
                        setTimeout(() => {
                            this.retailLog();
                        });
                    }
                }
            );

        }
        this.activeView = this.defaultView;
    }

    resetItemQty(cartIndex) {
        if (this.cartItems[cartIndex].ItemQty == '' || this.cartItems[cartIndex].ItemQty == '0' || this.cartItems[cartIndex].ItemQty == 0) {
            this.cartItems[cartIndex].ItemQty = 1;
            this.updateCalculation();
        }
        setTimeout(() => {
            this.retailLog();
        });
    }

    chooseUPC(itemUPC?: string) {
        if (typeof itemUPC != 'undefined' && itemUPC != null) {
            this.itemFetchMethod = 'key';
            this.scanUPC(itemUPC, true);
        }
        else if (this.activeSearchDataIndex != null && this.barcodeSearchData.length && typeof this.barcodeSearchData[this.activeSearchDataIndex] != 'undefined' && typeof this.barcodeSearchData[this.activeSearchDataIndex].UPC != 'undefined' && this.barcodeSearchData[this.activeSearchDataIndex].UPC != '') {
            this.itemFetchMethod = 'key';
            this.scanUPC(this.barcodeSearchData[this.activeSearchDataIndex].UPC, true);
        }
    }

    scanUPC(upc: string, putInCart?: boolean) {
        // console.log('scanUPC upc', upc);
        // console.log('scanUPC upc.length', upc.length);
        if (upc != null && typeof upc != 'undefined' && upc != '') {
            // this.barcode.code = upc;
            upc = upc.toString().replace(/^0+/, '');
            this.productDetails(upc).subscribe(
                res => {
                    if (res && typeof res.ItemUPC != 'undefined' && res.ItemUPC.length) {
                        if (putInCart) {
                            if (this.itemFetchMethod == 'key') {
                                this.itemKeyedCount++;
                            }
                            else {
                                this.itemScannedCount++;
                            }
                            this.barcode = {
                                code: res.ItemUPC[0],
                                price: res.ItemPrice
                            };
                            // this.barcode.price = res.ItemPrice;
                            this.prepareCart(res);
                        }
                    }
                    else {
                        this.barcode = {
                            code: '',
                            price: '0.00'
                        };
                    }
                }
            );
        }
    }

    productDetails(upc: string): Observable<any> {
        return this._helper.apiGetLocal(`get_item_scan/${upc}/16059B07CE`).pipe(
            // return this._helper.apiGetLocal(`get_item_scan/${upc}/${this.userDevices.scanner.serialNumber}`).pipe(
            map(
                res => {
                    if (res.status == 1) {
                        return res.result;
                    }
                    else {
                        this.barcode = {
                            code: '',
                            price: '0.00'
                        };
                        this._helper.notify({ message: res.message, messageType: res.status });
                        return false;
                    }
                },
                error => {
                    this.barcode = {
                        code: '',
                        price: '0.00'
                    };
                    console.log('error', error);

                }
            )
        );
    }

    prepareCart(itemDetails: any) {
        // console.log('this.barcode.code', this.barcode.code);
        clearTimeout(this.resetScanTimeout);
        let tempCartIndex: any = 0;
        let existInCart = this.cartItems.filter((list) => list.ReturnUPC == this.barcode.code);
        let initQty: number = 1;
        if (this.scanWithQty.isQtySet && parseInt(this.scanWithQty.qty)) {
            initQty = parseInt(this.scanWithQty.qty);
        }
        itemDetails.ItemIDEntryMethodCode = this.itemFetchMethod;
        if (existInCart.length) {
            this.cartItems.forEach((value, key) => {
                if (itemDetails.ReturnUPC == value.ReturnUPC) {
                    this.cartItems[key]['ItemQty'] = parseInt(value.ItemQty) ? parseInt(value.ItemQty) + initQty : initQty;
                    initQty = this.cartItems[key]['ItemQty'];
                    tempCartIndex = key.toString();
                    this.setInputElement(this.activeCartItemIndex, 'number', 'itemQty');
                    // this.resetScan();
                    this.updateCalculation();
                }
            });
        }
        else {
            itemDetails['ItemQty'] = initQty;
            itemDetails['VoidFlag'] = 0;
            itemDetails['SequenceNumber'] = this.saleActivitySequence;
            itemDetails['isShowable'] = true;
            this.saleActivitySequence++;
            this.cartItems.push(itemDetails);
            tempCartIndex = this.cartItems.length == 1 ? '0' : (this.cartItems.length - 1).toString();
            this.setInputElement(this.activeCartItemIndex, 'number', 'itemQty');
            // this.resetScan();
            this.updateCalculation();
        }
        this.resetScanTimeout = setTimeout(() => {
            this.activeCartItemIndex = tempCartIndex;
            this.resetScan();
            this.itemFetchMethod = 'scan';
        }, 100);
        // console.log('this.cartItems', this.cartItems);
        // console.log('this.activeCartItemIndex', this.activeCartItemIndex);
        setTimeout(() => {
            this.retailLog();
        });
        return true;
    }

    updateCalculation() {
        let itemCount: number = 0;
        let subtotal: number = 0;
        let discount: number = 0;
        let salesTax: number = 0;
        let total: number = 0;
        let payments: number = 0;
        let balance: number = 0;
        let change: number = 0;
        this.cartItems.forEach((value, key) => {
            if (value.isShowable) {
                if (parseFloat(value.ItemPrice) && parseInt(value.ItemQty)) {
                    let qtyPrice: any = parseFloat(value.ItemPrice) * parseInt(value.ItemQty);
                    if (!parseInt(value.ItemQty)) qtyPrice = 0;
                    subtotal += qtyPrice;
                    // qtyPrice = this._decimalPipe.transform(qtyPrice, '1.2-2');
                    this.cartItems[key]['ItemTotalPrice'] = qtyPrice;
                }
                else {
                    this.cartItems[key]['ItemTotalPrice'] = 0;
                }
                itemCount += parseInt(value.ItemQty) ? parseInt(value.ItemQty) : 0;
            }
        });
        total = subtotal;
        if (this.paymentMode == 'cash') {
            payments = this.getCashAmount();
            if (payments != 0) this.saleCashAmount = payments;
            if (this.saleCashAmount != '') {
                this.saleCashAmount = (this._decimalPipe.transform(this.saleCashAmount, '1.2-2')).replace(/,/g, '');
            }
            // if ((this._globals.REGEXP_DECIMAL.test(this.saleCashAmount) || this.saleCashAmount == 0) && parseFloat(this.saleCashAmount)) {
            // 	payments = parseFloat(this.saleCashAmount);
            // }
            // else {
            // 	payments = 0;
            // }
            if (payments >= total) {
                change = payments - total;
                balance = 0;
            }
            else {
                balance = total - payments;
                change = 0;
            }
        }
        this.cartDetails = {
            itemCount: itemCount,
            subtotal: subtotal,
            discount: discount,
            salesTax: salesTax,
            total: total,
            payments: payments,
            balance: balance,
            change: change
        }
        // console.log('this.cartDetails', this.cartDetails);
    }

    openCustomer() { }

    syncDataServer(): void {
        this._helper.apiGetLocal('itemsync/').subscribe(
            res => { },
            error => {
                console.log('error', error);

            }
        );
        this._helper.apiGetLocal('suppliersync/').subscribe(
            res => { },
            error => {
                console.log('error', error);

            }
        );
    }

    restoreTerminal() {
        let temp: any = sessionStorage.getItem('terminalData');
        if (typeof temp != 'undefined' && temp != null && this._helper.isJsonString(temp)) {
            this.terminalData = JSON.parse(temp);
            setTimeout(() => {
                for (let key in this.terminalData) {
                    console.log(key, this.terminalData[key])
                    if (this.terminalData.hasOwnProperty(key)) {
                        this[key] = this.terminalData[key];
                    }
                }
                if (this.barcodeInputHasFocus || this.isLookupEnable) {
                    this.barcodeInputField.nativeElement.focus();
                }
                else if (this.custNameSearchInputHasFocus) {
                    this.custNameSearchInputField.nativeElement.focus();
                }
                else if (this.saleAmountInputHasFocus) {
                    this.saleAmountInputField.nativeElement.focus();
                }
                if (!this.hasDenominationRecord) {
                    this.resetDenomination();
                }
            });
        }
        else {
            setTimeout(() => {
                this.resetDenomination();
                this.barcodeInputField.nativeElement.focus();
            });
        }
    }

    async tenderData() {
        let denominations: any = [];
        for (let denomination in this.denominationRecord) {
            if (this.denominationRecord.hasOwnProperty(denomination)) {
                denominations.push(this.denominationRecord[denomination]);
            }
        }
        let tender = {
            Tender: {
                is_chng_flag: 0,
                Amount: (this._decimalPipe.transform(this.cartDetails.total, '1.2-2')).replace(/,/g, ''),
                Denomination: denominations
            },
            SequenceNumber: this.saleActivitySequence,
        };
        return tender;
    }

    async retailLog() {
        // console.log('cartItems', this.cartItems);
        let now: any = this._helper.getCurrentDateTime();
        let retailLogData: any = sessionStorage.getItem('retailLogData');
        let lineItems: any = [];
        let lineItem: any;
        let tender: any;
        let itemScannedPer: any = (this.itemScannedCount / (this.itemScannedCount + this.itemKeyedCount)) * 100;
        let itemKeyedPer: any = (this.itemKeyedCount / (this.itemScannedCount + this.itemKeyedCount)) * 100;
        itemScannedPer = this._decimalPipe.transform(itemScannedPer, '1.2-2');
        itemKeyedPer = this._decimalPipe.transform(itemKeyedPer, '1.2-2');
        if (this.lockedTime != null && this.unlockedTime != null) {
            this.lockElapsedTime += this._helper.timeDiff(this.lockedTime, this.unlockedTime).seconds;
            this.lockedTime = null;
            this.unlockedTime = null;
        }
        await this.cartItems.forEach(element => {
            lineItem = {
                Sale: {
                    POSIdentity: {
                        POSItemID: parseInt(element.ItemUPC[0])
                    },
                    ItemType: 'Stock',
                    ActionCode: 'SL',
                    ItemIDEntryMethodCode: element.ItemIDEntryMethodCode, // Between 4 Char.
                    RegularSalesUnitPrice: element.ItemPrice,
                    ExtendedDiscountAmount: '0.00',
                    ActualSalesUnitPrice: element.ItemPrice,
                    ExtendedAmount: (this._decimalPipe.transform(element.ItemPrice * element.ItemQty, '1.2-2')).replace(/,/g, ''),
                    InventoryValuePrice: '0.00',
                    UnitCostPrice: element.UnitCostPrice,
                    UnitListPrice: element.UnitListPrice,
                    Quantity: element.ItemQty
                },
                SequenceNumber: element.SequenceNumber,
                VoidFlag: element.VoidFlag
            };
            lineItems.push(lineItem);
        });
        if (this.isAddTender) {
            let tenderData: any = await this.tenderData();
            lineItems.push(tenderData);
        }
        tender = {
            Tender: {
                SerialIdentificationNumberRequiredFlag: 0,		// gift certificates, checks, travelers checks, etc.
                AuthorizationRequiredFlag: 0,		// if authorization required to accept a specific tender
                AuthorizationMethodCode: '',		// checks may be authorized by either a third party or by validation against the customer's driving license
                AuthorizationExpirationDateRequiredFlag: 0,		// if tender requires an authorization expiration date and that it must be recorded at the time of settlement
                AuthorizationMaximumWaitAllowedSecondsCount: 0,		// maximum time delay (measured in seconds) allowed to wait for external tender authorization for this tender type.
                CustomerIdentificationRequiredFlag: 0,		// signify that customer identification is required, such as driver's license
                PersonalIdentificationNumberRequiredFlag: 0,		// if customer to enter a personal identification number (PIN) to validate the method of payment
                CustomerSignatureRequiredFlag: 0,		// if customer need to sign the tender (check) or resultant voucher (card) in the presence of the operator
                AccountIdentificationRequiredFlag: 0,		// if status of the account has to be checked before this method of tender can be accepted
                OnLineTenderFloorApprovalAmount: '0.00',		// The value of an individual tender above which authorization has to be sought before acceptance. This limit is normally referred to as the floor limit and may vary by merchandise and store
                OnLineTenderCeilingApprovalAmount: '0.00',		// The maximum amount of an individual tender type that can be authorized either in-house or by a third party. This especially applies to checks where the check authorization company sets a ceiling by retailer
                OffLineTenderFloorApprovalAmount: '0.00',		// The value of an individual tender below which approval is not required
                OffLineTenderCeilingApprovalAmount: '0.00',		// The maximum value of an individual tender that can be accepted without authorization
                MinimumAcceptAmount: '0.00',		// The minimum value that can be accepted for an individual tender. For example, certain retailers will not accept card payments below $5
                MaximumAcceptAmount: '0.00', 		// The maximum amount that can be accepted for a specific tender type
                OverrideTriggerMaximumAmount: '0.00',		// A trigger to override the maximum amount normally accepted for a specific tender type
                LoanPermissibilityFlag: 0,		// A flag to signify whether a specific transaction can be paid for on credit
                ItemRestrictionsApplyFlag: 0,		// A flag to signify that specific groups of items cannot be purchased using certain tender types. For example, food stamps cannot be used to purchase alcohol or tobacco items
                LocalCurrencyAvailabilityFlag: 0,		// A flag to signify that change can be offered to the customer in the currency tendered
                RealtimeBalanceUpdateFlag: 0,		// A flag to signify that the customer's account is updated in real-time
                EndorsementRequiredFlag: 0,		// A flag to signify that an endorsement, normally the customer's signature, is required before a specific tender type can be accepted.
                OpenCashDrawerRequiredFlag: 0,		// A flag that signifies that the cash drawer opens if a certain specific tender type is offered by the customer. For example, cash. Other forms of tender, such as checks, can be inserted into the till through a slit in the cash drawer door without the cash drawer opening, or alternatively, into a separate security device adjacent to the register
                ChangeThresholdAmount: '0.00', 		// The maximum change that can be offered to a customer for a specific tender type
                UnitCountRequiredFlag: 0,		// A flag to signify that specific tender type units need to be counted and recorded by the operator prior to a pickup
                AmountCountRequiredFlag: 0,		// A flag to signify that a specific tender type amount needs to be counted and recorded by the operator prior to a pickup
                AcceptanceForPaymentOnAccountFlag: 0,		// A flag to signify that a certain tender type can be accepted to credit a customer's account
                MagneticStripeReaderRequiredFlag: 0,		// A flag to signify that the tender type has to be inserted into the magnetic card reader. For example, credit and debit cards
                CheckEncodingFlag: 0,		// A flag to denote whether a check is encoded with the bank deposit account and the reserve and transit number to facilitate automated handling by the EXTERNAL DEPOSITORY
                PayOutPermissibilityFlag: 0		// A boolean indicator that tells if this TENDER may be paid out from a till as part of a miscellaneous expense or other properly authorized tender disbursement. If this flag is set to NO, this TENDER may NOT be paid out of a till
            }
        };
        let saleItemScanRequest: any = {};
        saleItemScanRequest.IsCompleted = this.retailLogIsCompleted;
        if (this.ringStartTime == null) {
            this.ringStartTime = new Date();
        }
        if (this.retailLogIsCompleted == 1) {
            this.idleStartTime = new Date();
            this.idleEndTime = null;
            saleItemScanRequest.EndTime = now.dateTime;
            this.ringEndTime = new Date();
            this.ringElapsedTime = this._helper.timeDiff(this.ringStartTime, this.ringEndTime).seconds;
        }
        else {
            saleItemScanRequest.EndTime = null;
        }
        if (this.retailLogIsCompleted == 0 && this.idleStartTime != null) {
            this.idleEndTime = new Date();
            this.idleElapsedTime = this._helper.timeDiff(this.idleStartTime, this.idleEndTime).seconds;
            this.idleStartTime = null;
        }
        saleItemScanRequest.StartTime = null;
        if (typeof retailLogData != 'undefined' && retailLogData != null && this._helper.isJsonString(retailLogData)) {
            retailLogData = JSON.parse(retailLogData);
            if (typeof retailLogData.StartTime == 'undefined' || retailLogData.StartTime == null) {
                saleItemScanRequest.StartTime = now.dateTime;
            }
            else {
                saleItemScanRequest.StartTime = retailLogData.StartTime;
            }
            if (typeof retailLogData.SaleStartTime == 'undefined' || retailLogData.SaleStartTime == null) {
                this.saleStartTime = now.dateTime;
            }
            else {
                this.saleStartTime = retailLogData.SaleStartTime;
            }
            if (typeof retailLogData._id != 'undefined') {
                saleItemScanRequest._id = retailLogData._id;
            }
        }
        else {
            saleItemScanRequest.StartTime = now.dateTime;
            saleItemScanRequest.SaleStartTime = now.dateTime;
            this.saleStartTime = now.dateTime;
        }
        saleItemScanRequest.SaleStartTime = this.saleStartTime;
        saleItemScanRequest.SaleEndTime = this.saleEndTime;
        saleItemScanRequest.TenderStartTime = this.tenderStartTime;
        saleItemScanRequest.TenderEndTime = this.tenderEndTime;
        saleItemScanRequest.Transaction = {
            TillID: this.signOnData.TillID,
            CancelFlag: this.wholeSalesIsCanceled,
            VoidedFlag: this.wholeSalesIsVoid,
            SuspendedFlag: 0,
            RetailTransaction: {
                RingElapsedTime: this.ringElapsedTime,
                TenderElapsedTime: this.tenderElapsedTime,
                IdleElapsedTime: this.idleElapsedTime,
                LockElapsedTime: this.lockElapsedTime,
                UnitCount: this.cartItems.length,
                LineItemsScannedCount: this.itemScannedCount,
                LineItemsScannedPercent: itemScannedPer,
                LineItemsKeyedCount: this.itemKeyedCount,
                LineItemsKeyedPercent: itemKeyedPer,
                KeyDepartmentCount: 0,
                KeyDepartmentPercent: 0,
                ReceiptDateTime: null,
                Customer: this.customer.id,
                CustomerIDEntryMethodCode: null,
                CustomerIDTypeCode: null,
                Channel: null,
                RetailShoppingTripTypeCode: null,
                TransactionEntryModeCode: null,
                ISOCurrencyCode: null,
                CustomerSurvey: null,
                LineItem: lineItems
            }
        };
        this._helper.apiPostLocal(saleItemScanRequest, 'item-purchase/').subscribe(
            res => {
                if (res.result && res.status == 1) {
                    if (this.retailLogIsCompleted == 1) {
                        this._helper.doPrint(this.cartItems);
                        sessionStorage.removeItem('retailLogData');
                        this.hasDenominationRecord = false;
                        this.resetDenomination();
                        // sessionStorage.removeItem('terminalData');
                        this.openingBalance += this.cartDetails.total;
                        this._helper.apiPostLocal({ defaultBalance: this.openingBalance }, 'check-till-balance').subscribe(
                            response => { }
                        )
                        this._helper.apiGetLocal('retail-transaction-sync/').subscribe(
                            res => { },
                            error => {
                                console.log('error', error);

                            }
                        );
                        this.resetSale(false);
                    }
                    else {
                        sessionStorage.setItem('retailLogData', JSON.stringify(res.result));
                    }
                }
            },
            error => console.log('error', error)
        );
    }

    denominations() {
        this._helper.apiGetLocal('denomination-list').subscribe(
            response => {
                if (response.status == 1 && response.result) {
                    let result: any = response.result;
                    let currentLength: number = result.length;
                    let diff: number = this.denominationListLength - currentLength;
                    let temp: any = [];
                    for (let index = 0; index < diff; index++) {
                        temp.push({});
                    }
                    this.denominationList = temp.concat(result);
                    this.restoreTerminal();
                    // this.resetDenomination();
                }
            },
            error => console.log('denominations error', error)
        );
    }

    ngOnInit() {
        let currentUserString = localStorage.getItem('currentUser');
        this.currentUser = JSON.parse(currentUserString);
        let signOnDataString = localStorage.getItem('signOnData');
        this.signOnData = JSON.parse(signOnDataString);
        this.userName = this.currentUser.name;
        this.workStationId = this.currentUser.workstationid;
        this.locationName = this.currentUser.location_name;
        let savedUserDevices = localStorage.getItem('userDevices');
        this.userDevices = JSON.parse(savedUserDevices);
        if (typeof this.userDevices != 'undefined' && this.userDevices != null && typeof this.userDevices.scanner != 'undefined') {
            scannerStatus(this.userDevices.scanner);
        }
        if (typeof savedUserDevices != 'undefined' && savedUserDevices != null && JSON.parse(savedUserDevices)) {
            this.userDevices = JSON.parse(savedUserDevices);
            if (typeof this.userDevices.scanner != 'undefined' && this.userDevices.scanner != null) {
                scannerStatus(this.userDevices.scanner);
            }
        }
        else {
            // this.connectScanner();
        }
        this.defaultCurrency = this._helper.defaultCurrency();
        this.barcodeInputHasFocus = true;
        this.cartDetails = {
            itemCount: 0,
            subtotal: 0,
            discount: 0,
            salesTax: 0,
            total: 0,
            payments: 0,
            balance: 0,
            change: 0
        };
        this._helper.apiGetLocal('check-till-balance').subscribe(
            response => {
                if (response.status == 1) {
                    this.openingBalance = response.result.defaultBalance;
                }
            }
        )
        this.subscription = this.searchTextChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                if (this.activeInputView == 'product') {
                    this.search();
                }
                else if (this.activeInputView == 'customer') {
                    this.searchCustomer();
                }
            });
        // this.syncDataServer();
        this.denominations();
        // this.restoreTerminal();
        this._helper.setTitle({ section: 'saleMode', title: `Sale Mode - ${this._globals.APP_NAME}` });
    }

    ngOnDestroy() {
        this.terminalData.cartItems = this.cartItems;
        this.terminalData.cartDetails = this.cartDetails;
        this.terminalData.activeElementModel = this.activeElementModel;
        this.terminalData.activeElementType = this.activeElementType;
        this.terminalData.activeElementReference = this.activeElementReference;
        this.terminalData.activeView = this.activeView;
        this.terminalData.activeInputView = this.activeInputView;
        this.terminalData.isLookupEnable = this.isLookupEnable;
        this.terminalData.barcodeText = this.barcodeText;
        this.terminalData.barcode = this.barcode;
        this.terminalData.barcodeInputHasFocus = this.barcodeInputHasFocus;
        this.terminalData.scanWithQty = this.scanWithQty;
        this.terminalData.showBarcodeLoader = this.showBarcodeLoader;
        this.terminalData.barcodeSearchData = this.barcodeSearchData;
        this.terminalData.activeCartItemIndex = this.activeCartItemIndex;
        this.terminalData.activeSearchDataIndex = this.activeSearchDataIndex;
        this.terminalData.custNameSearch = this.custNameSearch;
        this.terminalData.custNameSearchInputHasFocus = this.custNameSearchInputHasFocus;
        this.terminalData.custNameSearchLoader = this.custNameSearchLoader;
        this.terminalData.custNameSearchData = this.custNameSearchData;
        this.terminalData.customer = this.customer;
        this.terminalData.saleAmountInputHasFocus = this.saleAmountInputHasFocus;
        this.terminalData.saleCashAmount = this.saleCashAmount;
        this.terminalData.paymentMode = this.paymentMode;
        this.terminalData.itemFetchMethod = this.itemFetchMethod;
        this.terminalData.itemScannedCount = this.itemScannedCount;
        this.terminalData.itemKeyedCount = this.itemKeyedCount;
        this.terminalData.lockElapsedTime = this.lockElapsedTime;
        this.terminalData.lockedTime = this.lockedTime;
        this.terminalData.unlockedTime = this.unlockedTime;
        this.terminalData.ringElapsedTime = this.ringElapsedTime;
        this.terminalData.tenderElapsedTime = this.tenderElapsedTime;
        this.terminalData.idleElapsedTime = this.idleElapsedTime;
        this.terminalData.ringStartTime = this.ringStartTime;
        this.terminalData.ringEndTime = this.ringEndTime;
        this.terminalData.idleStartTime = this.idleStartTime;
        this.terminalData.idleEndTime = this.idleEndTime;
        this.terminalData.saleStartTime = this.saleStartTime;
        this.terminalData.saleEndTime = this.saleEndTime;
        this.terminalData.tenderStartTime = this.tenderStartTime;
        this.terminalData.tenderEndTime = this.tenderEndTime;
        this.terminalData.currentTransactionMode = this.currentTransactionMode;
        this.terminalData.denominationRecord = this.denominationRecord;
        this.terminalData.hasDenominationRecord = this.hasDenominationRecord;
        this.terminalData.isAddTender = this.isAddTender;
        // console.log('terminal terminalData', this.terminalData);
        sessionStorage.setItem('terminalData', JSON.stringify(this.terminalData));
    }

    @HostListener('window:keyup.enter', ['$event'])
    keyEvent(event: KeyboardEvent) {
        // console.log('keyEvent event', event);
        if (event.key.toLowerCase() == 'enter') {
            this.manageEnterHit();
        }
    }

}
