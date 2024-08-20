import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatTableDataSource } from '@angular/material';
import { AuthenticationService } from '../../../services/authentication.service';
import { DialogsService } from '../../../services/dialogs.service';
import { Globals } from '../../../globals';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface PageData {
	moduleName: string,
	displayModuleName: string,
	moduleAPI: string,
	moduleLink: string,
	paginationSetup: {
		pageLimitOptions: [25, 50, 100],
		pageLimit: number,
		pageOffset: number,
		totalRecord: number
	},
	selectedListData: any
}

export interface PeriodicElement { }

@Component({
	selector: 'app-header-sidebar',
	templateUrl: './header-sidebar.component.html',
	styleUrls: ['./header-sidebar.component.scss']
})

export class HeaderSidebarComponent implements OnInit, OnDestroy {

	dialogData: any = {
		moduleName: "",
		columnSet: [],
		columnSetId: 0,
		columnSetName: ""
	};

	UserId: string = '';
	userName: string = '';
	userNameFirstLetter: string = '';
	currentUser: any = {};
	ColumnSetName: string = '';
	ColumnSetList: any = [];
	ColumnList: any = [];
	DBColumnListAdd: any = [];
	userPreSetColumns: boolean = false;
	isAddColClass: boolean = false;
	saveColumnSet: object = {};
	ColumnSetID: 0;
	ColumnSetFilterList: any = [];
	isColumnSaveChecked: boolean = false;
	isShowSideNav: boolean = false;
	searchText: string = '';
	listingType: string = 'isblocked';
	typeValue: any = '';
	ListingData: any;
	RecordsCount: any;
	apiLink: string;
	searchBoxFocused: boolean = false;
	isShowBackground: boolean = false;
	// isShowSubMenu: boolean = false;
	isShowSubMenu: string;
	currentLink: string;
	pageCopiedColumns: any = [];
	isColListClass: boolean;

	private searchTextChanged: Subject<string> = new Subject<string>();
	private subscription: Subscription;
	debounceTime = 500;

	headerMenu: Array<any> = [
		// {
		// 	title: 'Dashboard',
		// 	identifier: 'dashboard',
		// 	link: '/dashboard',
		// 	icon: 'icon-home',
		// 	isSelected: false
		// },
		{
			title: 'Items',
			identifier: 'items',
			icon: 'icon-box',
			isSelected: false,
			subMenu: [
				{
					title: 'Manage Items',
					identifier: 'manage-items',
					link: '/admin-mode/items',
					isSelected: false
				},
				{
					title: 'Item Groups',
					identifier: 'item-groups',
					link: '/admin-mode/item-groups',
					isSelected: false
				},
				{
					title: 'Brands',
					identifier: 'brands',
					link: '/admin-mode/brands',
					isSelected: false
				},
				{
					title: 'Sizes',
					identifier: 'sizes',
					link: '/admin-mode/sizes',
					isSelected: false
				},
				{
					title: 'Manufacturers',
					identifier: 'manufacturers',
					link: '/admin-mode/manufacturers',
					isSelected: false
				},
				{
					title: 'Suppliers',
					identifier: 'suppliers',
					link: '/admin-mode/suppliers',
					isSelected: false
				},
				{
					title: 'Service Providers',
					identifier: 'serviceproviders',
					link: '/admin-mode/serviceproviders',
					isSelected: false
				},
				{
					title: 'Merchandising',
					identifier: 'merchandising',
					link: '/admin-mode/merchandising',
					isSelected: false
				},
				{
					title: 'POS Department',
					identifier: 'posdepartment',
					link: '/admin-mode/posdepartment',
					isSelected: false
				},
				{
					title: 'Selling Rule',
					identifier: 'sellingrule',
					link: '/admin-mode/sellingrule',
					isSelected: false
				},
				{
					title: 'Unit Of Measurement',
					identifier: 'unitofmeasurement',
					link: '/admin-mode/unitofmeasurement',
					isSelected: false
				},
				// {
				// 			title: 'Business Unit',
				// 			identifier: 'businessunit',
				// 			link: '/admin-mode/businessunit',
				// 			isSelected: false
				// },
				// {
				// 			title: 'Site',
				// 			identifier: 'site',
				// 			link: '/admin-mode/site',
				// 			isSelected: false
				// },
				// {
				// 			title: 'Location',
				// 			identifier: 'location',
				// 			link: '/admin-mode/location',
				// 			isSelected: false
				// 		}
			]
		}
	];
	headerSubMenu: any = {
		title: '',
		identifier: '',
		subMenu: []
	};
	openSidebar: boolean = false;
	openFilter: boolean = false;
	refreshModuleList: any = [];
	isRefreshLoading: boolean = false;
	refreshableModules: any = [];

	isSyncing: boolean = false;
	isSyncLoading: boolean = false;
	syncType: string = '';
	syncStepperConfig: any = {
		currentStep: 1,
		initStep: 1,
		maxStep: 3,
		isDisabled: false,
		doneBtnText: 'Next',
		cancelBtnText: 'Cancel'
	};
	syncModuleList: any = [];
	syncModules: any = [];
	syncDataSource = new MatTableDataSource<PeriodicElement>(this.syncModuleList);
	syncDisplayedColumns: any = ['module', 'sync_status'];
	syncIndex: number = 0;
	syncPercent: number = 0;
	isTrackingSync: boolean = false;
	trackSyncTimeout: any;
	isSyncComplete: boolean = false;
	totalSyncDataCount: number = 0;
	syncModuleNames: any = [];

	@Input() pageData: PageData;
	@Output() getCommonData = new EventEmitter<{}>();
	@ViewChild('searchBox') searchBox: ElementRef;

	constructor(
		private _helper: HelperService,
		private _router: Router,
		private _authenticationService: AuthenticationService,
		private _dialog: DialogsService,
		private _hotkeysService: HotkeysService,
		private _globals: Globals
	) {
		// this._hotkeysService.add(new Hotkey(this._globals.SKEY_ADD, (event: KeyboardEvent): boolean => {
		// 	this.add();
		// 	return false; // Prevent bubbling
		// }));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_REFRESH, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'records', noSelectionCheck: true });
			//console.log('ts file sjpw');
			return e;
		}));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_ADD, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.add();
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_EDIT, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			this.getCommonData.emit({ hitListAction: 'edit' });
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_DEL, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'delete' });
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_ACT, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_DEACT, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			this.getCommonData.emit({ hitListAction: 'status', hitListActionValue: 0 });
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'status', hitListActionValue: 1 });
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_MASTER_CHECK, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'masterCheck', noSelectionCheck: true });
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_FIND, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			if (this.searchBoxFocused) {
				this.searchBox.nativeElement.blur();
			}
			else {
				this.searchBox.nativeElement.focus();
			}
			return e;
		}, ['INPUT', 'TEXTAREA', 'SELECT', 'MAT-CHECKBOX']));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_SELECT_DOWN, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'setSelectShift', hitListActionValue: 'down', noSelectionCheck: true });
			return e;
		}));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_SELECT_UP, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'setSelectShift', hitListActionValue: 'up', noSelectionCheck: true });
			return e;
		}));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_SELECT_FIRST, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'setSelectFirst', noSelectionCheck: true });
			return e;
		}));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_NEXT_PAGE, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'changePage', hitListActionValue: 'next', noSelectionCheck: true });
			return e;
		}));
		this._hotkeysService.add(new Hotkey(this._globals.SKEY_PREV_PAGE, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
			const e: ExtendedKeyboardEvent = event;
			e.returnValue = false;
			this.getCommonData.emit({ hitListAction: 'changePage', hitListActionValue: 'prev', noSelectionCheck: true });
			return e;
		}));
		if (window.innerWidth >= 1400) {
			this.isShowSideNav = true;
		}
		else {
			this.isShowSideNav = false;
		}
	}

	// sync start
	getSyncModuleList() {
		this.syncType = '1';
		this._helper.apiGetLocal('modulelists').subscribe(
			data => {
				this.syncModuleList = data;
				this.syncModuleList.forEach(
					(value, key) => {
						this.syncModuleList[key].isSelected = true;
					}
				);
			}
		);
	}

	syncStepperNavigate(direction: string) {
		// console.log('this.syncType', this.syncType);
		this.syncModules = [];
		if (direction == 'next') {
			if (this.syncStepperConfig.currentStep == this.syncStepperConfig.initStep) {
				if (this.syncType == '') {
					this._helper.notify({ message: 'Choose component to Sync.', messageType: 0 });
				}
				else if (this.syncType == '1') {
					this.syncStepperConfig.currentStep++;
				}
				else if (this.syncType == '2') {
					this.syncModules.push(
						{
							DisplayModuleName: "Items",
							ModuleName: "Items",
							DownloadingApi: "item-download",
							DataCount: "Processing..."
						}
					);
					this.syncStepperConfig.currentStep++;
					this.syncData();
				}
				else if (this.syncType == '3') {
					this.syncModules.push(
						{
							DisplayModuleName: "Transaction",
							ModuleName: "Transactions"
						}
					);
					this.syncStepperConfig.currentStep++;
					this.syncData();
				}
			}
			else if (this.syncStepperConfig.currentStep == this.syncStepperConfig.initStep + 1) {
				this.syncModules = this.syncModuleList.filter((list) => list.isSelected);
				// console.log('this.syncModules', this.syncModules);
				if (this.syncModules.length) {
					this.syncData();
				}
				else {
					this._helper.notify({ message: 'Choose component to Sync.', messageType: 0 });
				}
			}
			else if (this.syncStepperConfig.currentStep == this.syncStepperConfig.maxStep) {
				this.doneSync();
			}
		}
		// if (direction == 'next' && this.syncStepperConfig.currentStep != this.syncStepperConfig.maxStep) {
		// 	this.syncStepperConfig.currentStep++;
		// }
		if (direction == 'back' && this.syncStepperConfig.currentStep != this.syncStepperConfig.initStep) {
			this.syncStepperConfig.currentStep--;
			this.isSyncLoading = false;
		}
		if (this.syncStepperConfig.currentStep == this.syncStepperConfig.maxStep) {
			this.isSyncLoading = true;
			this.syncStepperConfig.cancelBtnText = 'Hide';
			this.syncStepperConfig.doneBtnText = 'Downloading...';
		}
		else {
			this.syncStepperConfig.doneBtnText = 'Next';
		}
	}

	syncSelect(event, key) {
		this.syncModuleList[key].isSelected = event.checked;
	}

	syncData() {
		// console.log('this.syncModules', this.syncModules);
		this.syncModuleNames = [];
		this.totalSyncDataCount = 0;
		this.syncModules.forEach(
			(value, key) => {
				this.syncModules[key].DataCount = 'Processing...';
				this.syncModuleNames.push(value.ModuleName);
			}
		);
		this.syncDataSource = new MatTableDataSource<PeriodicElement>(this.syncModules);
		this.syncStepperConfig.currentStep++;
		this._helper.apiGetLocal('empty-dbfiles').subscribe(
			res => {
				this._helper.apiGetLocal('count-modules').subscribe(
					res => {
						// console.log('count-modules res', res);
						for (let key in res) {
							console.log(key, res[key]);
							if (this.syncModuleNames.includes(key)) {
								let value = res[key];
								this.totalSyncDataCount += value;
							}
						}
						console.log('syncModuleNames', this.syncModuleNames);
						console.log('totalSyncDataCount', this.totalSyncDataCount);
						this.doSync();
						this.isTrackingSync = true;
						this.trackSyncProgress();
					}
				);
			}
		);
	}

	doSync() {
		localStorage.setItem('isSyncing', 'isSyncing ');
		if (this.syncModules.length && typeof this.syncModules[this.syncIndex] != 'undefined') {
			this._helper.apiGetLocal(this.syncModules[this.syncIndex].DownloadingApi).subscribe(
				res => {
					this.syncIndex++;
					this.doSync();
				},
				error => {
					console.log('error', error);
				}
			);
		}
		// else {
		// 	this.syncIndex = 0;
		// 	this.syncPercent = 100;
		// 	this.isSyncLoading = false;
		// 	this.syncStepperConfig.doneBtnText = 'Done';
		// }
	}

	trackSyncProgress() {
		let completedCount = 0;
		this._helper.apiGetLocal('downloaded-data').subscribe(
			res => {
				// console.log('trackSyncProgress', res.result);
				if (typeof this.trackSyncTimeout != 'undefined') {
					clearTimeout(this.trackSyncTimeout);
				}
				if (res.status == 1 && res.result.length) {
					let trackResult = res.result;
					// console.log(trackResult.length, this.syncDataSource.data.length);
					// console.log('this.syncModules', this.syncModules);
					// console.log('trackResult', trackResult);
					trackResult.forEach(
						(value1, key1) => {
							// console.log(value1.ModuleName, value1.Downloaded + ' of ' + value1.Total);
							completedCount += value1.Downloaded;
							this.syncModules.forEach(
								(value2, key2) => {
									if (value1.ModuleName == value2.ModuleName) {
										this.syncModules[key2].DataCount = `${value1.Downloaded} of ${value1.Total}`;
										if (parseInt(value1.Downloaded) == parseInt(value1.Total)) {
											this.syncRecord(value1.ModuleName);
										}
									}
								});
						});
				}
				this.trackSyncTimeout = setTimeout(() => {
					// console.log(completedCount, this.totalSyncDataCount);
					this.syncPercent = (completedCount / this.totalSyncDataCount) * 100;
					this.syncPercent = this.syncPercent > 100 ? 100 : this.syncPercent;
					if (this.totalSyncDataCount == completedCount || completedCount + 100 >= this.totalSyncDataCount) {
						this.syncIndex = 0;
						this.syncPercent = 100;
						this.isSyncLoading = false;
						this.syncStepperConfig.doneBtnText = 'Done';
						this.isTrackingSync = false;
					}
					if (this.isTrackingSync) {
						this.trackSyncProgress();
					}
				}, 2000);
			},
			error => {
				console.log('error', error);
			}
		);
	}

	syncRecord(moduleName: string): void {
		let temp: any = [];
		if (typeof localStorage.getItem('syncRecord') != 'undefined' && localStorage.getItem('syncRecord') != null && localStorage.getItem('syncRecord') != '') {
			temp = JSON.parse(localStorage.getItem('syncRecord'));
		}
		temp.push(moduleName);
		let unique: any = temp.filter(function (item, pos, self) {
			return self.indexOf(item) == pos;
		})
		localStorage.setItem('syncRecord', JSON.stringify(unique));
	}

	doneSync() {
		if (this.syncModuleNames.includes('Items')) {
			this._helper.apiGetLocal('item-download-completed').subscribe(
				res => { }
			);
		}
		// setTimeout(() => {
		// 	this._helper.apiGetLocal('backup-database').subscribe(
		// 		(response) => {
		// 			console.log('backup-database', response);
		// 		},
		// 		error => console.log('backup-database error', error)
		// 	)
		// }, 1000 * 30);
		this.cancelSync();
		this.getCommonData.emit({ hitListAction: 'records', noSelectionCheck: true });
		this._helper.apiPostLocal({}, 'check-database-latest').subscribe(
			res => {
				console.log('check-database-latest response', res);
			}
		);
	}

	cancelSync(): void {
		this.isSyncing = false;
		this.syncIndex = 0;
		this.syncPercent = 0;
		this.isSyncLoading = false;
		this.syncStepperConfig.doneBtnText = 'Done';
		this.isTrackingSync = false;
		this.syncStepperConfig.currentStep = 1;
	}

	showSync() {
		this.isSyncing = true;
	}
	// sync end

	refresh() {
		this.isRefreshLoading = true;
		this.refreshModuleList.forEach(
			(value, key) => {
				if (this.pageData.moduleName == value.ModuleName) {
					this._helper.apiGetLocal(value.DownloadingApi).subscribe(
						res => {
							this.isRefreshLoading = false;
							this.getCommonData.emit({ hitListAction: 'records', noSelectionCheck: true });
							// console.log('res', res);
						},
						error => console.log('error', error)
					)
				}
			}
		);
	}

	getRefreshModuleList() {
		if (typeof localStorage.getItem('refreshModuleList') == 'undefined' || localStorage.getItem('refreshModuleList') == null || !JSON.parse(localStorage.getItem('refreshModuleList'))) {
			this._helper.apiGetLocal('refreshlists').subscribe(
				data => {
					this.refreshModuleList = data;
					localStorage.setItem('refreshModuleList', JSON.stringify(this.refreshModuleList));
					this.setRefreshableModules();

				}
			);
		}
		else {
			this.refreshModuleList = JSON.parse(localStorage.getItem('refreshModuleList'));
			this.setRefreshableModules();
		}
	}

	setRefreshableModules() {
		this.refreshableModules = [];
		this.refreshModuleList.forEach(value => {
			this.refreshableModules.push(value.ModuleName);
		});
	}

	// goToMenu(menu) {
	// 	// console.log(menu);
	// 	if (typeof (menu.link) != 'undefined' && menu.link != '') {
	// 		this._router.navigate([menu.link]);
	// 	}
	// 	else if (typeof (menu.subMenu) != 'undefined' && menu.subMenu.length) {
	// 		this.headerSubMenu = menu;
	// 		this.isShowSubMenu = true;
	// 	}
	// }

	hideSideMenu(menuName: any) {
		// console.log('this.isShowSubMenu', this.isShowSubMenu);
		// this.isShowSubMenu = false;
		// return false;
		this.isShowSubMenu = menuName;
	}

	toggleFilter() {
		this.openFilter = !this.openFilter;
		this.getCommonData.emit({ openFilter: this.openFilter });
	}

	toggleSidebar() {
		this.isShowSideNav = !this.isShowSideNav;
		this.isShowBackground = !this.isShowBackground;
		this.getCommonData.emit({ isNavOpen: this.isShowSideNav });
	}

	toggleColumns() {
		this.ColumnSetID = 0;
		this.userPreSetColumns = true;
		this.userColumns();
	}

	logout() {
		this._authenticationService.logout();
		this._router.navigate(['/login']);
	}

	saveCheckValue(event: any) {
		//console.log(event);
		this.isColumnSaveChecked = event.checked;
	}

	add() {
		switch (this.pageData.moduleName) {
			// case 'Items': {
			// 	this._router.navigate(['/admin-mode/items/manage']);
			// }
			// 	break;
			default: {
				this.openSidebar = !this.openSidebar;
				this.getCommonData.emit({ openSidebar: this.openSidebar });
			}
		}
		// switch (this.pageData.moduleName) {
		// 	case 'Brands': {
		// 		this._dialog.brandManageDialog().subscribe(
		// 			response => {
		// 				if (response) {
		// 					this.getCommonData.emit({ dataAdded: true });
		// 				}
		// 			}
		// 		)
		// 	}
		// 		break;
		// 	case 'Sizes': {
		// 		this._dialog.sizeManageDialog().subscribe(
		// 			response => {
		// 				// console.log(response);
		// 				if (response) {
		// 					this.getCommonData.emit({ dataAdded: true });
		// 				}
		// 			}
		// 		)
		// 	}
		// 		break;
		// 	default:
		// 	//default block statement;
		// }
	}

	getLink() {
		let apiLink: string = this.pageData.moduleAPI;
		let length: number = apiLink.length;
		let lastChar: string = apiLink.charAt(length - 1);
		if (lastChar == '&') {
			this.apiLink = apiLink;
		}
		else {
			this.apiLink = `${apiLink}?`;
		}
		return this.apiLink;
	}

	changeSearchText() {
		this.searchTextChanged.next(this.searchText);
	}

	search() {
		this.apiLink = this.getLink();
		this.pageData.paginationSetup.pageOffset = 1;
		if (this.searchText.length) {
			this.getCommonData.emit({ isLoading: true });
			var url = `${this.apiLink}q=${this.searchText}&`;
			if (this.pageData.paginationSetup.pageOffset != 0 && this.pageData.paginationSetup.pageLimit != 0) {
				var url = `${this.apiLink}q=${this.searchText}&offset=${this.pageData.paginationSetup.pageOffset}&limit=${this.pageData.paginationSetup.pageLimit}&`;
			}
			this._helper.apiGetLocal(url).subscribe(
				data => {
					this.getCommonData.emit({ isLoading: false });
					// console.log(data);
					if (data.status == 1) {
						this.ListingData = data.result;
						this.RecordsCount = data.RecordsCount;
						this.getCommonData.emit({ ListingData: this.ListingData, SearchText: this.searchText, RecordsCount: this.RecordsCount });
					}
					else {
						this._helper.notify({ message: data.message, messageType: data.status });
					}
				},
				error => console.log(error)
			);
		}
		else {
			this.getListingData();
		}
	}

	getListingData() {
		this.getCommonData.emit({ isLoading: true });
		this.apiLink = this.getLink();
		this._helper.apiGetLocal(`${this.apiLink}offset=${this.pageData.paginationSetup.pageOffset}&limit=${this.pageData.paginationSetup.pageLimit}&`).subscribe(
			data => {
				//console.log(data);
				this.getCommonData.emit({ isLoading: false });
				if (data.status == 1) {
					this.ListingData = data.result;
					this.RecordsCount = data.RecordsCount;
					this.getCommonData.emit({ ListingData: this.ListingData, RecordsCount: this.RecordsCount, SearchText: this.searchText });
				} else {
					this._helper.notify({ message: data.message, messageType: data.status });
				}

			},
			error => console.log(error)
		);
	}

	userColumns() {
		this._helper.apiGet(`itemapis/columns-modifications/?ModuleName=${this.pageData.moduleName}&UserId=${this.UserId}&`).subscribe(
			data => {
				// console.log(data);
				this.ColumnSetList = data;
			},
			error => console.log(error)
		);
	}

	DbColumnsets() {
		this.isAddColClass = true;
		this.ColumnList = [];
		this.isColumnSaveChecked = false;
		if (this.pageCopiedColumns.length > 0) {
			//console.log(this.pageCopiedColumns);
			this.ColumnList = this.pageCopiedColumns;
		} else {
			this._helper.apiGet(`itemapis/column-details/?ModuleName=${this.pageData.moduleName}`).subscribe(
				data => {
					//console.log(data);
					this.ColumnList = data.data_type;
				},
				error => console.log(error)
			);
		}
	}

	getColoumnList() {
		this._helper.apiGet(`itemapis/column-details/?ModuleName=${this.pageData.moduleName}&`).subscribe(
			data => {
				// console.log(data);
				this.ColumnList = data.data_type;
			},
			error => console.log(error)
		);
	}

	changeColumnSet(event, columnSetName: string, i) {
		this.ColumnList[i].isDisplayed = event.checked;
		//console.log(this.ColumnList);

	}

	displayColumns(allColumns: any) {
		var displayedColumns = [];
		allColumns.forEach((value, key) => {
			if (value.isDisplayed) {
				displayedColumns.push(value.dbName);
			}
		});
		this.getCommonData.emit({ displayedColumns: displayedColumns });
		return displayedColumns;
	}

	manageModifyColumnSet() {
		this.ColumnSetFilterList = [];
		this.ColumnList.forEach((key, val) => {
			//console.log(key.isDisplayed);
			if (key.isDisplayed) {
				this.ColumnSetFilterList.push(key);
			} else {
				this.ColumnSetFilterList.push(key);
			}
		});
		//console.log(this.ColumnSetFilterList);
		if (this.ColumnSetFilterList.length > 0) {

			localStorage.removeItem(this.pageData.moduleName + "ColumnSet" + this.UserId);
			localStorage.setItem(this.pageData.moduleName + "ColumnSet" + this.UserId, JSON.stringify(this.ColumnSetFilterList));
			// console.log(this.pageData.moduleName+"ColumnSet"+this.UserId+'111111');

			// //localStorage.removeItem(this.pageData.moduleName+"ColumnSet"+this.UserId);
			// for (var i = 0, len = localStorage.length; i < len; i++) {
			// 	var key = localStorage.key(i);
			// 	var value = localStorage[key];
			// 	//if (key != "userid" && key != "password")
			// 	 //localStorage.removeItem(key);
			// 	console.log(key + " => " + value);
			// }
		}
		//console.log(localStorage.getItem(this.pageData.moduleName+"ColumnSet"+this.UserId));
		this.displayColumns(this.ColumnSetFilterList);
		if (!this.isColumnSaveChecked) {
			this.isAddColClass = false;
			this.userPreSetColumns = false;
		}
		if (this.ColumnSetID != 0) {
			if (this.isColumnSaveChecked) {
				this._dialog.columnManageDialog(this.ColumnSetName).subscribe(
					response => {
						if (response) {
							this.saveColumnSet = [{
								id: this.ColumnSetID,
								UserId: this.UserId,
								ModuleName: this.pageData.moduleName,
								ColumnSetName: response.columnSetName,
								ColumnSet: this.ColumnSetFilterList
							}];
							this._helper.apiPut(this.saveColumnSet, 'itemapis/columns-modifications/').subscribe(
								res => {
									if (res.message) {
										this._helper.notify({ message: res.message });
									}
								},
								error => {
									console.log('error', error);
								}
							);
							this.userColumns();
							this.isAddColClass = false;
							this.userPreSetColumns = false;
						}
					}
				)
			}
		} else {
			if (this.isColumnSaveChecked) {
				this._dialog.columnManageDialog(this.ColumnSetName = '').subscribe(
					response => {
						if (response) {
							this.saveColumnSet = {
								UserId: this.UserId,
								ModuleName: this.pageData.moduleName,
								ColumnSetName: response.columnSetName,
								ColumnSet: this.ColumnSetFilterList
							};
							this._helper.apiPost(this.saveColumnSet, 'itemapis/columns-modifications/').subscribe(
								res => {
									if (res.message) {
										this._helper.notify({ message: res.message });
									}
								},
								error => {
									console.log('error', error);
								}
							);
							this.userColumns();
							this.isAddColClass = false;
							this.userPreSetColumns = false;

						}
					}
				)
			}
		}
	}

	editColumnSet(ColumnSetIndex) {
		//console.log(ColumnSetIndex);
		let userColumnSet = JSON.parse(ColumnSetIndex.ColumnSet);
		//console.log(userColumnSet);
		this.isAddColClass = true;
		this.ColumnList = userColumnSet;
		// this.ColumnList = this.ColumnList.filter((list) => {
		// 	if (list.isUsed) {
		// 		return true;
		// 	}
		// });
		this.ColumnSetID = ColumnSetIndex.id;
		this.ColumnSetName = ColumnSetIndex.ColumnSetName;
		this.isColumnSaveChecked = true;
	}

	columnDargDrop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(this.ColumnList, event.previousIndex, event.currentIndex);
		}
	}

	deleteColumnSet(moduleName: string, userId, columnSet: any) {
		const deleteMessage = `Do you want to delete this custom column set?`;
		this._helper.confirmDialog({ message: deleteMessage }).subscribe(res => {
			if (res) {
				var deleteData = JSON.stringify([columnSet]);
				this._helper.apiRequest('delete', 'itemapis/columns-modifications/', { body: deleteData }).subscribe(res => {
					if (res["message"]) {
						this._helper.notify({ message: res["message"], messageType: res["status"] });
					}
					if (res["status"] == 1) {
						this.userColumns();
						this.userPreSetColumns = false;
					}
				});
			}
		}
		);
	}

	DisplayPreSetCoulmns(ColumnSetIndex) {
		let userColumnSet = JSON.parse(ColumnSetIndex.ColumnSet);
		this.displayColumns(userColumnSet);
		this.userPreSetColumns = false;
		localStorage.removeItem(this.pageData.moduleName + "ColumnSet" + this.UserId);
		localStorage.setItem(this.pageData.moduleName + "ColumnSet" + this.UserId, JSON.stringify(userColumnSet));
		this.pageCopiedColumns = JSON.parse(localStorage.getItem(this.pageData.moduleName + "ColumnSet" + this.UserId));
		this.ColumnList = this.pageCopiedColumns;
	}

	ngOnChanges(changes: SimpleChanges) {
		const change: SimpleChange = changes.pageData;
		this.pageData = change.currentValue;
		this._helper.moduleName = this.pageData.moduleName;
		// console.log('ngOnChanges this.pageData', this.pageData);
	}

	ngOnInit() {
		// console.log('ngOnInit this.pageData', this.pageData);
		this._helper.moduleName = typeof this.pageData.moduleName == 'undefined' || this.pageData.moduleName == null || this.pageData.moduleName == '' ? '' : this.pageData.moduleName;
		let currentUserString = localStorage.getItem('currentUser');
		this.currentUser = JSON.parse(currentUserString);
		this.userName = this.currentUser.name;
		this.userNameFirstLetter = this.userName.substring(0, 1);
		this.currentLink = this._router.url;
		this.headerMenu.forEach((value, key) => {
			if (value.link && value.link == this.currentLink) {
				this.headerMenu[key].isSelected == true;
			}
			else if (value.subMenu && value.subMenu.length) {
				value.subMenu.forEach((subValue, subKey) => {
					if (subValue.link && subValue.link == this.currentLink) {
						this.headerMenu[key].isSelected == true;
						this.headerMenu[key].subMenu[subKey].isSelected = true;
						this.headerSubMenu = value;
						// this.isShowSubMenu = true;
						this.isShowSubMenu = value.title;
					}
				});
			}
		});

		this.subscription = this.searchTextChanged
			.pipe(
				debounceTime(this.debounceTime),
			)
			.subscribe(() => {
				this.search();
			});

		this.UserId = '6';
		//console.log(this.UserId);
		if (this.pageData.moduleName + "ColumnSet" + this.UserId in localStorage) {
			this.pageCopiedColumns = JSON.parse(localStorage.getItem(this.pageData.moduleName + "ColumnSet" + this.UserId));
		}
		if (this.pageCopiedColumns.length > 0) {
			//console.log(this.pageCopiedColumns);
			this.displayColumns(this.pageCopiedColumns);
		}

		this.getSyncModuleList();
		this.getRefreshModuleList();
		this.getColoumnList();
		this.userColumns();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.isTrackingSync = false;
		this._helper.moduleName = '';
	}

}
