import { Injectable } from '@angular/core';
import { Employee } from './model';

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  private employees: Employee[] = [];
  sharedData: any;
  constructor() { }
  setData(data: any): void {
    this.sharedData = data;
  }

  getData(): any {
    return this.sharedData;
  }
}
