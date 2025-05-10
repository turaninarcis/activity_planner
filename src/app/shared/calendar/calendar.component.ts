import { NgFor, NgIf, NgClass,CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivityShortDTO } from '../../../Models/activities.model';
@Component({
  selector: 'app-calendar',
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnChanges {


  currentDate: Date = new Date();
  days: (number | null)[] = [];
  monthYear: string = '';
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  @Input() activities:ActivityShortDTO[] | null = null;

  activitiesForSelectedDay: any[] = [];
  showModal: boolean = false;
  selectedDay: number | null = null;


  groupedActivities: { [key: string]: ActivityShortDTO[] } = {};
  ngOnInit() {
    this.renderCalendar();
  }

    ngOnChanges(changes: SimpleChanges): void {
      if(changes['activities']){
        this.groupActivitiesByDay();
      }
  }



  groupActivitiesByDay() {
    this.groupedActivities = {};
    if(!this.activities) return;
    this.activities.forEach(activity => {
      const date = new Date(activity.startDate);
      console.log(date.toDateString());
      const key = this.formatKey(date);
      if (!this.groupedActivities[key]) {
        this.groupedActivities[key] = [];
      }
      this.groupedActivities[key].push(activity);
    });
  }

  formatKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    this.monthYear = this.currentDate.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric',
    });

    this.days = [];

    for (let i = 0; i < startDay; i++) {
      this.days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      this.days.push(i);
    }
  }

  changeMonth(offset: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderCalendar();
    this.showModal = false;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  getActivities(day: number): any[] {
    const key = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}`;
    return this.groupedActivities[key] || [];
  }

  showActivities(day: number | null): void {
    if(day==null) return;
    this.selectedDay = day;
    this.showModal = true;
    console.log(day);

    this.activitiesForSelectedDay = this.getActivities(day);
    console.log(this.activitiesForSelectedDay);
  }

  closeModal(): void {
    this.showModal = false;
  }
}
