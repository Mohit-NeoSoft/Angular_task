import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpService } from '../emp.service';
import { Employee } from '../model';
import { IndexedDBService } from '../service/indexdb.service';
import { SignalService } from '../service/signal.service';
import { ModeService } from '../service/mode.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('role') role!: ElementRef;
  @Output() employeeUpdated = new EventEmitter<Employee>();
  selectedrole = '';
  addEmpForm!: FormGroup;
  selectedMonth = null;
  newEmployee: Employee = new Employee();
  sharedData: any;
  updatebtn = false;
  emp_id: any;
  employeedata: any;
  submitted = false;
  isCalendarOpen = false;
  selectedField: 'empstartDate' | 'empendDate' | null = null;
  empstartDate: Date | null = null;
  empendDate: Date | null = null;
  selectedStartDate: Date | null = null;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private empservice: EmpService,
    private indexService: IndexedDBService,
    private signalService: SignalService,
    private modeService: ModeService
  ) { }

  ngOnInit() {
    this.modeService.getUpdateMode().subscribe(isUpdateMode => {
      this.sharedData = this.empservice.getData();
      if (!isUpdateMode) this.sharedData = undefined;
  
      this.updatebtn = !!this.sharedData;
  
      this.addEmpForm = this.formBuilder.group({
        empName: ['', [Validators.required]],
        empRole: ['', [Validators.required]],
        empstartDate: ['', [Validators.required]],
        empendDate: ['']
      });
  
      if (this.sharedData) {
        this.addEmpForm.patchValue({
          empName: this.sharedData.empName,
          empRole: this.sharedData.empRole,
          empstartDate: this.sharedData.empstartDate ? this.formatDate(this.sharedData.empstartDate) : null,
          empendDate: this.sharedData.empendDate ? this.formatDate(this.sharedData.empendDate) : null
        });
  
        this.empstartDate = this.sharedData.empstartDate ? new Date(this.sharedData.empstartDate) : null;
        this.empendDate = this.sharedData.empendDate ? new Date(this.sharedData.empendDate) : null;
      }
    });
  }

  onCancel() {
    this.goBack();
  }

  get f() {
    return this.addEmpForm.controls;
  }

  onSelected(): void {
    this.selectedrole = this.role.nativeElement.value;
  }

  addEmployee() {
    this.submitted = true;
    if (this.addEmpForm.invalid) {
      return;
    }
    const employee = this.addEmpForm.value;
    console.log(employee);

    this.indexService.addEmployee(employee).then(() => {
      this.signalService.employeeAdded.emit(employee);
      this.goBack()
    })
    this.ngOnInit();
  }

  goBack() {
    this.router.navigate(['/employeeList']);
  }

  async updateEmployee() {
    this.submitted = true;
    console.log(this.addEmpForm.value);
    this.employeedata = this.addEmpForm.value;
    const updatedEmployee = { ...this.sharedData, ...this.employeedata };

    await this.indexService.updateEmployee(updatedEmployee).then(() => {
      this.signalService.employeeUpdated.emit(updatedEmployee);
      this.goBack();
    })
    alert('Updated successfully');
    this.addEmpForm.reset();
  }

  setDate(option: string) {
    const today = new Date();
    let selectedDate = today;

    switch (option) {
      case 'today':
        break;
      case 'nextMonday':
        selectedDate.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
        break;
      case 'nextTuesday':
        selectedDate.setDate(today.getDate() + ((2 + 7 - today.getDay()) % 7 || 7));
        break;
      case 'oneWeek':
        selectedDate.setDate(today.getDate() + 7);
        break;
    }

    this.addEmpForm.patchValue({ empstartDate: selectedDate });
  }

  openCalendar(field: 'empstartDate' | 'empendDate') {
    this.selectedField = field;
    this.isCalendarOpen = true;
  }

  closeCalendar() {
    this.isCalendarOpen = false;
    this.selectedField = null;
  }

  setSelectedDate(date: Date, field: 'empstartDate' | 'empendDate') {
    if (!date) return;
  
    const formattedDate = this.formatDate(date);

    if (field === 'empstartDate') {
      this.empstartDate = date;
      this.addEmpForm.controls['empstartDate'].setValue(formattedDate);
  
      if (this.empendDate && this.empendDate < this.empstartDate) {
        this.empendDate = null;
        this.addEmpForm.controls['empendDate'].setValue(null);
      }
    } else if (field === 'empendDate') {
      if (this.empstartDate && date < this.empstartDate) return;
      this.empendDate = date;
      this.addEmpForm.controls['empendDate'].setValue(formattedDate);
    }
  
    this.closeCalendar();
  }
  

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'No Date';
  
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
    if (isNaN(parsedDate.getTime())) return 'No Date';
  
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsedDate);
  }
  
}
