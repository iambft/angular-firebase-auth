import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { ListConfig } from '../list/list.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class AddItemComponent {
  @Input() set dataConfig(value: ListConfig[]) {
    if(!this.form) {
      this.initForm(value);
      this.config.set(value);
    }
  }
  @Input() isLoading: boolean | null = false;
  @Output() onAddItem = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  public config = signal<ListConfig[]>([]);
  public form!: FormGroup;

  private initForm(list: ListConfig[]): void {
    const group = list.reduce((acc, { key }) => {
      acc[key] = this.fb.control('');
      return acc;
    }, {} as Record<string, FormControl>);
    this.form = this.fb.group(group);
  }

  resetForm(): void {
    this.form.reset();
  }
}
