import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private isUpdateMode = new BehaviorSubject<boolean>(false);

  setUpdateMode(isUpdateMode: boolean) {
    this.isUpdateMode.next(isUpdateMode);
  }

  getUpdateMode() {
    return this.isUpdateMode.asObservable();
  }
}