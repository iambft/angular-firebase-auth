import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../auth/services/auth-state.service';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ListComponent, ListConfig } from '../shared/components/list/list.component';
import { AddItemComponent } from '../shared/components/add-item/add-item.component';
import { LIST_CONFIG } from './list.config';
import { ListItemsDBService } from './list-items-db.service';
import { BehaviorSubject } from 'rxjs';

export interface ListData {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, ListComponent, AddItemComponent],
})
export class HomeComponent implements OnInit {
  @ViewChild(AddItemComponent) addItemComponent!: AddItemComponent;
  private authService = inject(AuthStateService);
  private db = inject(ListItemsDBService);

  listConfig: ListConfig[] = LIST_CONFIG;
  listData = signal<ListData[]>([]);
  isLoading$ = new BehaviorSubject(false);

  ngOnInit() {
    this.getList();
  }

  getList(): void {
    this.db.get().subscribe(data => {
      this.listData.set(data);
    })
  }

  onAddItem(item: any): void {
    this.isLoading$.next(true);
    this.db.add(item).subscribe(() => {
      this.listData.update(values => [...values, item]);
      this.isLoading$.next(false);
      this.addItemComponent.resetForm();
    });
  }

  onLogOut(): void {
    this.authService.logout();
  }
}
