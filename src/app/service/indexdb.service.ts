// indexeddb.service.ts
import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { Employee } from '../model';

interface MyDB extends DBSchema {
  employees: {
    value: Employee;
    key: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('my-database', 1, {
      upgrade(db) {
        db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async addEmployee(employee: Employee) {
    const db = await this.dbPromise;
    const tx = db.transaction('employees', 'readwrite');
    const store = tx.objectStore('employees');
    await store.add(employee);
  }

  async getEmployees(): Promise<Employee[]> {
    const db = await this.dbPromise;
    const tx = db.transaction('employees', 'readonly');
    const store = tx.objectStore('employees');
    return store.getAll();
  }

  async updateEmployee(employee: Employee) {
    const db = await this.dbPromise;
    const tx = db.transaction('employees', 'readwrite');
    const store = tx.objectStore('employees');
    await store.put(employee);
  }

  async deleteEmployee(employeeId: number) {
    const db = await this.dbPromise;
    const tx = db.transaction('employees', 'readwrite');
    const store = tx.objectStore('employees');
    await store.delete(employeeId);
  }
}

