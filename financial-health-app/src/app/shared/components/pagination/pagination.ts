import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html', // Original name
  styleUrls: ['./pagination.scss']  // Original name
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculateTotalPages();
    }
  }

  private calculateTotalPages(): void {
    if (this.totalItems > 0 && this.itemsPerPage > 0) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      // Basic pagination display logic: show a few pages around current page
      const maxPagesToShow = 5; // Max number of page links to show (e.g., 1 ... 4 5 6 ... 10)
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      // Adjust startPage if endPage is at the limit and there are not enough pages shown
      if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      this.pages = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

    } else {
      this.totalPages = 0;
      this.pages = [];
    }
  }

  selectPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.selectPage(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.selectPage(this.currentPage + 1);
    }
  }
}
