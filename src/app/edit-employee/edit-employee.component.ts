import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent {
  addEmpForm!: FormGroup
  role = [
    { id: 1, name: "Product Designer  " },
    { id: 2, name: "Flutter Developer" },
    { id: 3, name: "QA Tester" },
    { id: 4, name: "Product Owner" },
  ];
  selectedMonth = null
  constructor(public formBuilder: FormBuilder, private router: Router,) { }
  ngOnInit() {
    this.addEmpForm = this.formBuilder.group({
      empName: ['', [Validators.required]],
      empRole: ['', [Validators.required]],
      empstartDate: ['', [Validators.required]],
      empendDate: ['', [Validators.required]]

    })
  }
}
