import { inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { collection, getFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export abstract class AbstractDBService {
  app = inject(FirebaseApp);
  abstract dataPath: string;

  #collaction: any;

  constructor() { }

  get collection(): any {
    if(!this.#collaction) {
      const db = getFirestore(this.app);
      this.#collaction = collection(db, this.dataPath);
    }

    return this.#collaction;
  }

  abstract get(): Observable<any>;

  abstract add(item: any): Observable<any>;
}

