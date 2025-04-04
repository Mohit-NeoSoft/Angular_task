import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from '../service/indexdb.service';
import { Employee } from '../model';
import { EmpService } from '../emp.service';
import { SignalService } from '../service/signal.service';
import { Subscription } from 'rxjs';
import { ModeService } from '../service/mode.service';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css']
})
export class EmployeelistComponent implements OnInit {
  employees: Employee[] = [];
  selectedDate: Date | null = null;
  previousemp: any[] = [];
  currentemp: any[] = [];
  employeeAddedSubscription!: Subscription;
  employeeUpdatedSubscription!: Subscription;
  employeeDeletedSubscription!: Subscription;
  isUpdateMode!: boolean;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private indexService: IndexedDBService,
    private empservice: EmpService,
    private signalService: SignalService,
    private modeService: ModeService
  ) {
    this.employeeAddedSubscription = this.signalService.employeeAdded.subscribe((employee: Employee) => {
      this.loadEmployees();
    });

    this.employeeUpdatedSubscription = this.signalService.employeeUpdated.subscribe((employee: Employee) => {
      this.loadEmployees();
    });

    this.employeeDeletedSubscription = this.signalService.employeeDeleted.subscribe((employeeId: number) => {
      this.loadEmployees();
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  ngOnDestroy() {
    this.employeeAddedSubscription.unsubscribe();
    this.employeeUpdatedSubscription.unsubscribe();
    this.employeeDeletedSubscription.unsubscribe();
  }

  async loadEmployees() {
    try {
      const response = await this.indexService.getEmployees();
      console.log(response);
      this.employees = response;

      this.previousemp = this.employees.filter(employee => employee.empendDate !== "" && employee.empendDate !== null);
      this.currentemp = this.employees.filter(employee => employee.empendDate === "" || employee.empendDate === null);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  add() {
    this.isUpdateMode = false;
    this.modeService.setUpdateMode(this.isUpdateMode);
    this.router.navigate(['/addEmployee']);
  }

  async updateEmployee(employee: Employee) {
    this.isUpdateMode = true;
    this.modeService.setUpdateMode(this.isUpdateMode);
    this.empservice.setData(employee);
    this.router.navigate(['/addEmployee']);
  }

  async deleteEmployee(employeeId: number) {
    const confirmation = confirm('Are you sure you want to delete employee?');
    if (confirmation) {
      try {
        await this.indexService.deleteEmployee(employeeId);
        this.loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  }

  openCalendar() {
    const dialogRef = this.dialog.open(CalendarComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedDate = result;
      }
    });
  }
}
