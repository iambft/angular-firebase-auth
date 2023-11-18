import { Injectable } from '@angular/core';
import { addDoc, getDocs } from '@angular/fire/firestore';
import { Observable, defer, map } from 'rxjs';
import { AbstractDBService } from 'src/app/shared/abstractions/abstract-db.service';

@Injectable({
  providedIn: 'root'
})
export class ListItemsDBService extends AbstractDBService {
  dataPath = 'list';

  get(): Observable<any> {
    return defer(() => getDocs(this.collection)).pipe(
      map(citySnapshot => citySnapshot.docs.map(doc => doc.data()))
    );
  }

  add(item: any): Observable<any> {
    return defer(() => addDoc(this.collection, item));
  }
}

