import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface ListConfig {
  key: string;
  label: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule]
})
export class ListComponent {
  @Input() dataSource!: any[];
  @Input() set dataConfig(value: ListConfig[]) {
    this.listConfig.set(value);
  }

  listConfig = signal<ListConfig[]>([]) ;
  columnKeys = computed<string[]>(() => this.listConfig().map(val => val.key));
}
