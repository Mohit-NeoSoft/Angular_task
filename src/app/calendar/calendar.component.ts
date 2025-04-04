import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @Input() selectedDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() fieldType: 'empstartDate' | 'empendDate' | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() closePopup = new EventEmitter<void>();

  today = new Date();
  selectedDateControl = new FormControl(new Date());

  ngOnInit() {
    if (this.selectedDate) {
      this.selectedDateControl.setValue(new Date(this.selectedDate));
    }
  }

  setDate(days: number | null) {
    if (days === null) {
      this.selectedDateControl.setValue(null);
    } else {
      const newDate = new Date();
      newDate.setDate(this.today.getDate() + days);
      this.selectedDateControl.setValue(newDate);
    }
  }

  getNextWeekday(targetDay: number) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNext = (targetDay + 7 - dayOfWeek) % 7 || 7;
    return daysUntilNext;
  }

  onDateChange(date: Date | null) {
    this.selectedDateControl.setValue(date);
  }

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    return d && this.minDate && d < this.minDate ? 'disabled-date' : '';
  };

  saveDate() {
    const selectedValue = this.selectedDateControl.value;
      this.dateSelected.emit(selectedValue || undefined);
      this.closePopup.emit();
  }

  cancel() {
    this.closePopup.emit();
  }
}
