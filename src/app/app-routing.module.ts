import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtcComponent } from './components/otc/otc.component';
import { MyComponent } from './components/my/my.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { UserComponent } from './components/user/user.component';
import { HelpComponent } from './components/help/help.component';
import { ChatComponent } from './components/chat/chat.component';
import { PostAdComponent } from './components/post-ad/post-ad.component';
import { MyAdComponent } from './components/my-ad/my-ad.component';
import { TrustListComponent } from './components/trust-list/trust-list.component';
import { CoinActionComponent } from './components/coin-action/coin-action.component';
import { CoinSelectComponent } from './components/element/coin-select/coin-select.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { HelpCenterComponent } from './components/help/help-center/help-center.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SetNicknameComponent } from './components/set-nickname/set-nickname.component';
import { UserSettingComponent } from './components/user-setting/user-setting.component';
import { UserRealCertificationComponent } from './components/user-real-certification/user-real-certification.component';
import { UserTransactionPasswordComponent } from './components/user-transaction-password/user-transaction-password.component';
import { UserEmailComponent } from './components/user-email/user-email.component';
import { UserLanguageComponent } from './components/user-language/user-language.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { HomeComponent } from './components/home/home.component';
import { AdOrdersComponent } from './components/ad-orders/ad-orders.component';
import { MyTransComponent } from './components/my-trans/my-trans.component';
import { TransactionBComponent } from './components/transaction-b/transaction-b.component';
import { OrderDetailBComponent } from './components/order-detail-b/order-detail-b.component';
import { AdShowComponent } from './components/ad-show/ad-show.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'otc', component: OtcComponent},
  {path: 'wallet', component: WalletComponent},
  {path: 'my', component: MyComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'setNickName', component: SetNicknameComponent},
  {path: 'forgetPassword', component: ForgetPasswordComponent},
  {path: 'userSetting', component: UserSettingComponent},
  {path: 'userRealCert', component: UserRealCertificationComponent},
  {path: 'userTransactionPassword', component: UserTransactionPasswordComponent},
  {path: 'userEmail', component: UserEmailComponent},
  {path: 'userLanguage', component: UserLanguageComponent},
  {path: 'transaction', component: TransactionComponent},
  {path: 'user', component: UserComponent},
  {path: 'help', component: HelpComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'postAd', component: PostAdComponent},
  {path: 'myAd', component: MyAdComponent},
  {path: 'trustList', component: TrustListComponent},
  {path: 'coinAction', component: CoinActionComponent},
  {path: 'coinSelect', component: CoinSelectComponent},
  {path: 'transactionList', component: TransactionListComponent},
  {path: 'helpCenter', component: HelpCenterComponent},
  {path: 'orderDetail', component: OrderDetailComponent},
  {path: 'adOrders', component: AdOrdersComponent},
  {path: 'myTrans', component: MyTransComponent},
  {path: 'transactionB', component: TransactionBComponent},
  {path: 'orderDetailB', component: OrderDetailBComponent},
  {path: 'adShow', component: AdShowComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
