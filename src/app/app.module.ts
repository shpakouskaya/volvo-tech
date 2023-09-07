import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RightSideListComponent } from './components/right-side-list/right-side-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import {HttpClientModule} from "@angular/common/http";
import { PostFormComponent } from './components/post-form/post-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import {JwtModule} from "@auth0/angular-jwt";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LoginComponent } from './components/login/login.component';


export function tokenGetter(): string | null {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return currentUser.token;
}

@NgModule({
  declarations: [
    AppComponent,
    RightSideListComponent,
    FooterComponent,
    HeaderComponent,
    PostFormComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
