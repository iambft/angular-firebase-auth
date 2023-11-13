import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { Firestore, connectFirestoreEmulator, getFirestore, initializeFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environment/environment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      let firestore: Firestore;
      if(environment.useEmulators) {
        firestore = initializeFirestore(getApp(), { experimentalForceLongPolling: true })
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      } else {
        firestore = getFirestore()
      }
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();

      if(environment.useEmulators) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      }
      return auth;
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
