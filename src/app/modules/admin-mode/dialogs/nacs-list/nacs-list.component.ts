import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
export interface PeriodicElement {
  number: number,
  nacs_category: string,
  nacs_subcategory: string
}
@Component({
  selector: 'app-nacs-list',
  templateUrl: './nacs-list.component.html',
  styleUrls: ['./nacs-list.component.scss']
})
export class NacsListComponent implements OnInit {

  dataList: any[];
  dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectedListData: any = [];
  private static readonly INDEX = 'nacs_code_master';
  selectedList: any = [];
  dataColumn: any = ['select', 'nacs_category', 'nacs_subcategory'];
  arrListId: any = [];
  ItemData: any = [];
  ItemID: any = '';
  SelectedsupplerList: any[];
  obj: any = {};
  strMsg: boolean = false;
  paginationSetup: any = {
    pageLimitOptions: [25, 50, 100],
    pageLimit: 25,
    pageOffset: 0,
    totalRecord: 0
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSpinnerLoaderShow: boolean = false;
  colname: string = '';
  order_by: string = '';
  searchText: string = '';
  editItemID: any = [];
  artificialArray: PeriodicElement[] = [];

  constructor(
    public elasticsearchService: ElasticsearchService,
    private route: Router,
    public dialogRef: MatDialogRef<NacsListComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit() {
    this.getDataListForDataTable();
    this.dialogData.data.forEach((item, index) => {
      this.setSelected(item);
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows || numSelected >= numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach((value, key) => {
        this.selectedList = this.selectedList.filter((list) => list != value.number);
        this.selectedListData = this.selectedListData.filter((list) => list.number != value.number);
      });
    }
    else {
      this.dataSource.data.forEach((value, key) => {
        this.selection.select(value);
        if (!this.selectedList.includes(value.number)) {
          this.selectedList.push(value.number);
          this.selectedListData.push(value);
        }
      });
    }
  }



  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  prepareMatTable() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataList);
  }

  setPreSelect() {
    this.dataSource.data.forEach((value, key) => {
      if (this.selectedList.includes(value.number)) {
        this.selection.select(value);
      }
    });
  }
  setSelect(row) {
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.selectedList.push(row.number);
      this.selectedListData.push(row);
    }
    else {
      this.selectedList = this.selectedList.filter((list) => list != row.number);
      this.selectedListData = this.selectedListData.filter((list) => list.number != row.number);
    }
  }
  setSelected(row) {
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.selectedList.push(row.number);
      this.selectedListData.push(row);
    }

  }

  getDataListForDataTable(pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit, colname: string = this.colname, order_by = this.order_by) {
    if (this.searchText.length) {
      this.getSearchedData();
    }
    else {

      this.elasticsearchService.nacsData(
        NacsListComponent.INDEX, pageOffset, pageLimit, colname, order_by).then(
          response => {
            this.artificialArray = []
            if (response.hits.hits != null) {
              response.hits.hits.forEach((item, index) => {
                this.artificialArray.push(item._source);
              });
            }
            this.isSpinnerLoaderShow = true;
            this.dataList = this.artificialArray;
            this.paginationSetup.totalRecord = response.hits.total;
            // this.dataSource.data= this.artificialArray as PeriodicElement[];
            this.prepareMatTable();
            this.setPreSelect();
          }, error => {
            console.error(error);
          }).then(() => {
            // console.log('Search Completed!');
          });
    }

  }
  public getSearchedData(pageOffset: number = this.paginationSetup.pageOffset, pageLimit: number = this.paginationSetup.pageLimit) {
    this.elasticsearchService.nacsDataSearch(
      NacsListComponent.INDEX, pageOffset, pageLimit, this.searchText).then(
        response => {
          this.artificialArray = []
          response.hits.hits;
          if (response.hits.hits != null) {
            response.hits.hits.forEach((item, index) => {
              this.artificialArray.push(item._source);
            });
          }
          this.isSpinnerLoaderShow = true;
          this.dataList = this.artificialArray;
          this.paginationSetup.totalRecord = response.hits.total;
          // this.dataSource.data= this.artificialArray as PeriodicElement[];
          this.prepareMatTable();
          this.setPreSelect();
        }, error => {
          console.error(error);
        }).then(() => {
          // console.log('Search Completed!');
        });
  }
  addSelectedList() {
    this.dialogRef.close(this.selectedListData);
  }
  loadPage() {
    this.getDataListForDataTable(this.paginator.pageIndex, this.paginator.pageSize);
  }
  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //    this.dataSource.paginator = this.paginator;
  // }
  resetSearch() {
    this.searchText = "";
    this.getDataListForDataTable();
  }
  search(e) {
    if (this.searchText.length) {
      this.getSearchedData();
    }
    else {
      this.getDataListForDataTable();
    }
  }
  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadPage())
      )
      .subscribe();
  }
  sortData(event) {
    if (event.direction != "") {
      this.getDataListForDataTable(this.paginator.pageIndex, this.paginator.pageSize, event.active, event.direction);
    }
  }


}
