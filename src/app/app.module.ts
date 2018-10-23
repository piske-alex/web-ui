import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { RequestCache } from './request-cache.service';
import { CachingInterceptor } from './caching-interceptor.service';
import { HttpAuthInterceptorService } from './providers/http/http-auth-interceptor.service';
import { HttpService } from './providers/http/http.service';

import {MatDialogModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OtcComponent } from './components/otc/otc.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { MyComponent } from './components/my/my.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { ListTransactionComponent } from './components/element/list-transaction/list-transaction.component';
import { UserDetailComponent } from './components/element/user-detail/user-detail.component';
import { MenuComponent } from './components/element/menu/menu.component';
import { UserComponent } from './components/user/user.component';
import { ListAdComponent } from './components/element/list-ad/list-ad.component';
import { HelpComponent } from './components/help/help.component';
import { ChatComponent } from './components/chat/chat.component';
import { ListChatComponent } from './components/element/list-chat/list-chat.component';
import { PostAdComponent } from './components/post-ad/post-ad.component';
import { MyAdComponent } from './components/my-ad/my-ad.component';
import { TrustListComponent } from './components/trust-list/trust-list.component';
import { CoinActionComponent } from './components/coin-action/coin-action.component';
import { CoinActionDepositComponent } from './components/element/coin-action-deposit/coin-action-deposit.component';
import { CoinActionWithrawComponent } from './components/element/coin-action-withraw/coin-action-withraw.component';
import { CoinActionTransferComponent } from './components/element/coin-action-transfer/coin-action-transfer.component';
import { CoinSelectComponent } from './components/element/coin-select/coin-select.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { HelpCenterComponent } from './components/help/help-center/help-center.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SelectSingleComponent } from './components/element/select-single/select-single.component';
import { SelectCountryComponent } from './components/element/select-country/select-country.component';
import { SelectAdTypeComponent } from './components/element/select-ad-type/select-ad-type.component';
import { SelectCoinTypeComponent } from './components/element/select-coin-type/select-coin-type.component';
import { SelectCurrencyComponent } from './components/element/select-currency/select-currency.component';
import { I18nComponent } from './components/element/i18n/i18n.component';
import { SelectPayTypeComponent } from './components/element/select-pay-type/select-pay-type.component';
import { SelectDuringTimeComponent } from './components/element/select-during-time/select-during-time.component';
import { SelectTwoComponent } from './components/element/select-two/select-two.component';
import { ListDealComponent } from './components/element/list-deal/list-deal.component';
import { SetNicknameComponent } from './components/set-nickname/set-nickname.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { UserRealCertificationComponent } from './components/user-real-certification/user-real-certification.component';
import { UserTransactionPasswordComponent } from './components/user-transaction-password/user-transaction-password.component';
import { UserEmailComponent } from './components/user-email/user-email.component';
import { UserLanguageComponent } from './components/user-language/user-language.component';
import { AvatarPipe } from './pipes/avatar/avatar.pipe';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { HomeComponent } from './components/home/home.component';
import { CoinNumberPipe } from './pipes/coin/coin-number.pipe';
import { PcMenuComponent } from './components/pc-menu/pc-menu/pc-menu.component';
import { SelectMultiComponent } from './components/element/select-multi/select-multi/select-multi.component';
import { AdOrdersComponent } from './components/ad-orders/ad-orders.component';
import { MyTransComponent } from './components/my-trans/my-trans.component';
import { ListAdMyComponent } from './components/element/list-ad-my/list-ad-my.component';
import { ListTradeComponent } from './components/element/list-trade/list-trade.component';
import { OrderDetailBComponent } from './components/order-detail-b/order-detail-b.component';
import { TransactionBComponent } from './components/transaction-b/transaction-b.component';
import { BtcFormatPipe } from './pipes/btcFormat/btc-format.pipe';
import { AdShowComponent } from './components/ad-show/ad-show.component';
import { CnyFormatPipe } from './pipes/cnyFormat/cny-format.pipe';
import { RateFormatPipe } from './pipes/rateFormat/rate-format.pipe';
import { SwiperSlideComponent } from './components/element/swiper-slide/swiper-slide.component';
import { MyMsgComponent } from './components/my-msg/my-msg.component';
import { ChatingComponent } from './components/chating/chating.component';
import { ListChatingComponent } from './components/element/list-chating/list-chating.component';
import { ConfirmDialogComponent } from './components/element/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './components/element/alert-dialog/alert-dialog.component';



library.add(fas);

const createTranslateLoader = function (http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  declarations: [
    AppComponent,
    OtcComponent,
    WalletComponent,
    MyComponent,
    ListTransactionComponent,
    TransactionComponent,
    UserDetailComponent,
    MenuComponent,
    UserComponent,
    ListAdComponent,
    HelpComponent,
    ChatComponent,
    ListChatComponent,
    PostAdComponent,
    MyAdComponent,
    TrustListComponent,
    CoinActionComponent,
    CoinActionDepositComponent,
    CoinActionWithrawComponent,
    CoinActionTransferComponent,
    CoinSelectComponent,
    TransactionListComponent,
    HelpCenterComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    SelectSingleComponent,
    SelectCountryComponent,
    SelectAdTypeComponent,
    SelectCoinTypeComponent,
    SelectCurrencyComponent,
    I18nComponent,
    SelectPayTypeComponent,
    SelectDuringTimeComponent,
    SelectTwoComponent,
    ListDealComponent,
    SetNicknameComponent,
    UserSettingComponent,
    UserRealCertificationComponent,
    UserTransactionPasswordComponent,
    UserEmailComponent,
    UserLanguageComponent,
    AvatarPipe,
    OrderDetailComponent,
    HomeComponent,
    CoinNumberPipe,
    PcMenuComponent,
    SelectMultiComponent,
    AdOrdersComponent,
    MyTransComponent,
    ListAdMyComponent,
    ListTradeComponent,
    OrderDetailBComponent,
    TransactionBComponent,
    BtcFormatPipe,
    AdShowComponent,
    CnyFormatPipe,
    RateFormatPipe,
    SwiperSlideComponent,
    MyMsgComponent,
    ChatingComponent,
    ListChatingComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  entryComponents: [
    ConfirmDialogComponent,
    AlertDialogComponent
  ],
  providers: [
    HttpService,
    RequestCache,
    // { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}
