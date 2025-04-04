import { EventEmitter, Injectable } from '@angular/core';
import { Employee } from '../model';

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  constructor() { }

  employeeAdded = new EventEmitter<Employee>();
  employeeUpdated = new EventEmitter<Employee>();
  employeeDeleted = new EventEmitter<number>();
}
