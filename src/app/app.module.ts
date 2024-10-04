import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthConfig, OAuthModule, OAuthService } from 'angular-oauth2-oidc';
export const linkedInAuthConfig: AuthConfig = {
  issuer: 'https://www.linkedin.com',
  redirectUri: window.location.origin + '/auth/linkedin/callback',
  clientId: '868w6zijo3wvc4', // Replace with LinkedIn client ID
  responseType: 'code',
  scope: 'r_liteprofile r_emailaddress',
  showDebugInformation: true,
};
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [

          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('847026557578774'), //local support
            // provider: new FacebookLoginProvider('513143014764831'), //local support
            // provider: new FacebookLoginProvider('950085863826651'), //local support
          }
        ],
        onError: (err) => {
        }
      } as SocialAuthServiceConfig,
    },
    OAuthService,
    {
      provide: AuthConfig,
      useValue: linkedInAuthConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private oauthService: OAuthService
  ){
    this.configureOAuth();
  }
  private configureOAuth(): void {
    this.oauthService.configure(linkedInAuthConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }
 }
