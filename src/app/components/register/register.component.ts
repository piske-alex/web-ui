import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { Router } from '@angular/router';
import { DialogService } from '../../providers/dialog/Dialog.service';

@Component({
  selector: 'gz-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  countryCode: any;
  countryCodes: any = [];
  phoneNo: string;
  smsCode: string;
  password: string;
  resendSmsCodeDelay = 0;

  passwordWarn = '';

  focusInput: string;
  isShowPassword: boolean;
  isAggreeTerms: boolean;

  i18ns: any = {};

  isShowConfirm: boolean;
  serv_items_en: string;
  serv_items_simp: string;
  serv_items_trad: string;
  language: string;

  constructor(private location: Location,
    private router: Router,
    private userService: UserService,
    private languageService: LanguageService,
    private commonService: CommonService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.countryCode = '86';

    try {
      this.countryCodes = await this.commonService.getCountryCodeList();
    } catch (e) {
      console.error(e);
    }

    this.i18ns.inputPhone = await this.languageService.get('user.inputPhone');
    this.i18ns.inputSmsCode = await this.languageService.get('user.inputSmsCode');
    this.i18ns.inputPassword = await this.languageService.get('user.inputPassword');
    this.i18ns.inputValidPhone = await this.languageService.get('user.inputValidPhone');
    this.i18ns.read_and_agree = await this.languageService.get('register.read_and_agree');
    this.i18ns.password_valid_warn_1 = await this.languageService.get('register.password_valid_warn_1');
    this.i18ns.password_valid_warn_2 = await this.languageService.get('register.password_valid_warn_2');
    this.i18ns.confirm = await this.languageService.get('common.confirm');
    // this.serv_items = await this.languageService.get('register.serv_items');

    this.language = this.getLanguageDefault();
    this.serv_items_simp = this._simplifiedChinese();
    this.serv_items_trad = this._traditionalChinese();
    this.serv_items_en = this._traditionalChinese();
  }

  goBack() {
    this.location.back();
  }

  focus(inputName: string) {
    this.focusInput = inputName;

    if (inputName === 'password') {
      this.passwordWarn = '';
    }
  }

  blur(inputName: string) {
    if (this.focusInput === inputName) {
      this.focusInput = '';
    }

    if (inputName === 'password') {
      this._validatePassword();
    }
  }

  isFocus(inputName: string): string {
    return this.focusInput === inputName ? 'active' : '';
  }

  showPassword(show: boolean) {
    this.isShowPassword = show;
  }

  showServiceItems(){
    this.isShowConfirm = true;
  }
  cancelDialog() {
    this.isShowConfirm = false;
  }

  async sendSmsCode() {
    this.resendSmsCodeDelay = 60;
    const _delayInterval = setInterval(() => {
      if (--this.resendSmsCodeDelay === 0) {
        clearInterval(_delayInterval);
      }
    }, 1000);

    try {
      await this.commonService.sendSmsCode({
        countryCallingCode: this.countryCode,
        phone: this.phoneNo,
        action: 'signup',
      });
    } catch (e) {
      console.error(e);
    }
  }

  async register() {

    if (!this.phoneNo) {
      return this.dialogService.alert(this.i18ns.inputPhone);
    }

    if (!(/^[\d]{6,15}$/g.test(this.phoneNo))) {
      return this.dialogService.alert(this.i18ns.inputValidPhone);
    }

    if (!this.smsCode) {
      return this.dialogService.alert(this.i18ns.inputSmsCode);
    }

    if (!this.password) {
      return this.dialogService.alert(this.i18ns.inputPassword);
    }

    if (!this._validatePassword()) {
      return;
    }

    if (!this.isAggreeTerms) {
      return this.dialogService.alert(this.i18ns.read_and_agree);
    }

    const _params = {
      countryCallingCode: this.countryCode,
      phone: this.phoneNo,
      verifyCode: this.smsCode,
      password: this.password,
      agree: this.isAggreeTerms,
    };
    try {
      const _result = await this.userService.register(_params);
      const _userId = _result.userId || '';
      const _token = _result.token;
      localStorage.setItem('user_id', _userId);
      localStorage.setItem('access_token', _token);
      localStorage.setItem('login_timestamp', Date.now() + '');

      this.router.navigate(['/setNickName', { userId: _userId }]);
    } catch (e) {
      if (e.error.success === false && e.error.errmsg !== undefined) {
        this.dialogService.alert(e.error.errmsg);
      }
      console.error(e);
    }

    // // TODO delete
    // this.router.navigate(['/setNickName', {userId: '123'}]);
    // // TODO delete end.
  }

  public getLanguageDefault(): string {
    let defWebSiteLang = localStorage.getItem("language");
    if(defWebSiteLang && defWebSiteLang!== "")
      return defWebSiteLang;

    let lang = navigator.language;
		let prifexLang = lang.substr(0, 2); //截取lang前2位字符
    if(prifexLang == "en")
      lang = "en-GB";
    return lang;
  }

  private _validatePassword(): boolean {
    this.password = this.password || '';
    if (this.password.length < 8) {
      this.passwordWarn = this.i18ns.password_valid_warn_1;
    } else if (!/[A-Z]{1,}/g.test(this.password) || !/[a-z]{1,}/g.test(this.password) || !/[\d]{1,}/g.test(this.password)) {
      this.passwordWarn = this.i18ns.password_valid_warn_2;
    } else {
      this.passwordWarn = '';
    }
    return this.passwordWarn.length === 0;
  }

  private _simplifiedChinese(): string {
    return `<p>
    通过使用本网站，注册KoinExchange帐户或使用我们的任何其他KoinExchange服务，您同意接受并遵守条款和使用条款。在使用本网站或任何KoinExchange服务之前，请仔细阅读完整的使用条款。本使用条款中使用的“KoinExchange”是指可盈可乐有限公司，包括但不限于其所有者，董事，投资者，员工或其他相关方。根据上下文，“KoinExchange”也可以指服务，产品，网站，内容或其他材料（统称为“KoinExchange服务”）。若您不接受以下条款，请您立即停止注册或主动停止使用本网站的服务。根据您所居住的国家/地区，您可能无法使用本网站的所有功能。您有责任遵守您访问本网站和服务的居住国家和/或国家/地区的这些规则和法律。请注意，KoinExchange有权对本协议进行修改，恕不另行通知补发，请您定期查看本条款，因为您继续使用该网站将被视为是不可撤销的接受任何修订。本条款不涉及KoinExchange用户与其他用户之间因比特币交易而产生的法律关系及法律纠纷。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>接受使用条款</b><b></b>
  </p>
  <p>
    通过使用本网站（“网站”），注册KoinExchange帐户（“帐户”）或使用我们的任何其他KoinExchange服务，您同意接受并遵守条款和使用条款。在使用本网站或任何KoinExchange服务之前，请仔细阅读完整的使用条款。本使用条款中使用的“KoinExchange”是指可盈可乐有限公司，包括但不限于其所有者，董事，投资者，员工或其他相关方。根据上下文，“KoinExchange”也可以指服务，产品，网站，内容或其他材料（统称为“KoinExchange服务”）。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>服务内容</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.KoinExchange运用自己的系统，通过互联网等方式为用户提供比特币交易服务。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.用户提供的注册资料，用户同意：
  </p>
  <p>
    （1）提供合法、真实、准确的个人资料；
  </p>
  <p>
    （2）如有变动，及时更新用户资料。如果用户提供的注册资料不合法、不真实、不准确的，用户需承担因此引起的相应责任及后果，并且KoinExchange保留终止用户使用KoinExchange各项服务的权利。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>服务的提供、修改及终止</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.用户在接受KoinExchange各项服务的同时，同意接受KoinExchange提供的各类信息服务。用户在此授权KoinExchange可以向其账户、电子邮件、手机等发送商业信息。用户可进入KoinExchange相关页面更改联系方式。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.KoinExchange保留随时修改或中断服务而不需通知用户的权利，KoinExchange有权行使修改或中断服务的权利，不需对用户或任何无直接关系的第三方负责。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.法律允许范围内，无论在以下何种情况下：信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、政府行为、司法行政机关的命令、其他不可抗力或第三方的不作为而造成的服务终止或服务延迟以及用户因此而遭受的损失，KoinExchange不承担责任。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用户对本协议的修改有任何异议或对KoinExchange的服务有任何不满，可以行使以下权利:
  </p>
  <p>
    （1）停止使用KoinExchange的网络服务。
  </p>
  <p>
    （2）通过客服、支持等渠道告知KoinExchange停止对其服务。结束服务后，用户使用KoinExchange网络服务条款的权利立即终止。在此情况下，KoinExchange没有义务传送任何未处理的消息或未完成&lt;的服务给用户或任何无直接关系的第三方。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>用户信息的保密</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.本协议所称之KoinExchange用户信息是指符合法律、法规及相关规定，并符合下述范围的信息：
  </p>
  <p>
    （1）用户注册KoinExchange时，向KoinExchange提供的个人信息；
  </p>
  <p>
    （2）用户在使用KoinExchange服务、参加网站活动或访问网站网页时，KoinExchange自动接收并记录的用户浏览器端数据，包括但不限于IP地址、网站Cookie中的资料及用户要求取用的网页记录；
  </p>
  <p>
    （3）KoinExchange从商业伙伴处合法获取的用户个人信息；
  </p>
  <p>
    （4）其它KoinExchange通过合法途径获取的用户个人信息。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.KoinExchange承诺未经法定原因或用户事先许可，KoinExchange不会向任何第三方透露用户的密码、姓名、手机号码、证件号码等非公开信息。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.在下述法定情况下，用户的个人信息将会被部分或全部披露。
  </p>
  <p>
    （1）经用户同意向用户本人或其他第三方披露；
  </p>
  <p>
    （2）根据法律、法规等相关规定，或行政机构要求，向行政、司法机构或其他法律规定的第三方披露；
  </p>
  <p>
    （3）其他KoinExchange根据法律、法规等相关规定进行的披露。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>用户权利</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.用户的用户名、密码和安全性
  </p>
  <p>
    （1）用户名不可重复注册。用户名一旦注册成功，不可更改。
  </p>
  <p>
    （2）用户一旦注册成功，成为KoinExchange的用户，将得到用户名（用户邮箱）和密码，并对以此组用户名和密码登入系统后所发生的所有活动和事件负责，自行承担一切使用该用户名发布的言语、行为等而直接或间接导致的法律责任。
  </p>
  <p>
    （3）用户有义务妥善保管KoinExchange账号、用户名和密码、短信验证码、谷歌验证码，用户将对用户名和密码、和谷歌密钥安全负全部责任。因用户原因导致用户名或密码、谷歌密钥泄露而造成的任何法律后果由用户本人负责，由于用户自身原因泄露这些信息导致的财产损失，本站不负相关责任。由于KoinExchange是交易网站，登录密码、防钓鱼码等不得使用相同密码，否则会有安全隐患，相关责任由用户自身承担。
  </p>
  <p>
    （4）用户密码遗失的，可以通过注册电子邮箱发送的链接重置密码。用户若发现任何非法使用用户名或存在其他安全漏洞的情况，应立即告知KoinExchange。
  </p>
  <p>
    （5）KoinExchange不会向任何用户索取密码，不会让用户往任何非本站交易中心里提供的帐户、BTC充值地址充值比特币，请大家不要相信任何非KoinExchange官方发布的诈骗信息，往非BTC交易中心提供的账户、地址里充值比特币造成的损失本站不负责任。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.用户有权修改其账户个人中心、安全设置中各项可修改信息，自行选择录入介绍性文字，自行决定是否提供非必填项的内容；
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.用户有权在KoinExchange浏览比特币的资讯详情以及交易信息并发表符合国家法律规定、KoinExchange社区规则的文章及观点；
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用户有权根据网站相关规定，获得KoinExchange给与的奖励（如手续费按比例返现等）；
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  5.用户有权按照KoinExchange发布的活动规则参与KoinExchange组织的各项线上、线下活动（包括各官方平台社区发起的活动）。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  6.用户有权查看其KoinExchange账号下的信息。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  7.用户有权根据KoinExchange网站规定，应用KoinExchange提供的功能进行操作、享受KoinExchange提供的其它各类服务。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>用户义务</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：
  </p>
  <p>
    （1）煽动抗拒、破坏宪法和法律、行政法规实施的；
  </p>
  <p>
    （2）煽动颠覆国家政权，推翻社会主义制度的；
  </p>
  <p>
    （3）煽动分裂国家、破坏国家统一的；
  </p>
  <p>
    （4）煽动民族仇恨、民族歧视，破坏民族团结的；
  </p>
  <p>
    （5）捏造或者歪曲事实，散布谣言，扰乱社会秩序的；
  </p>
  <p>
    （6）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；
  </p>
  <p>
    （7）公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；
  </p>
  <p>
    （8）损害国家机关信誉的；
  </p>
  <p>
    （9）其他违反宪法和法律行政法规的；
  </p>
  <p>
    （10）进行商业广告行为的。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.用户不得通过任何手段恶意注册KoinExchange帐号，包括但不限于以牟利、炒作、套现等为目的多个账号注册。用户亦不得盗用其他用户帐号。如用户违反上述规定，则KoinExchange有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在网站获得的星级、荣誉以及虚拟财富，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.禁止用户将KoinExchange以任何形式作为从事各种非法活动的场所、平台或媒介。未经KoinExchange的授权或许可，用户不得借用本站的名义从事任何商业活动，也不得以任何形式将KoinExchange作为从事商业活动的场所、平台或媒介。如用户违反上述规定，则KoinExchange有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在网站获得的星级、荣誉以及虚拟财富，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用户在KoinExchange以各种形式发布的一切信息，均应符合国家法律法规等相关规定及网站相关规定，符合社会公序良俗，并不侵犯任何第三方主体的合法权益，否则用户自行承担因此产生的一切法律后果，且KoinExchange因此受到的损失，有权向用户追偿。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>拒绝担保与免责</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.KoinExchange作为“网络服务提供者”的第三方平台，不担保网站平台上的信息及服务能充分满足用户的需求。对于用户在接受KoinExchange的服务过程中可能遇到的错误、侮辱、诽谤、不作为、淫秽、色情或亵渎事件，KoinExchange不承担法律责任。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.基于互联网的特殊性，KoinExchange也不担保服务不会受中断，对服务的及时性、安全性都不作担保，不承担非因KoinExchange导致的责任。KoinExchange力图使用户能对本网站进行安全访问和使用，但KoinExchange不声明也不保证本网站或其服务器是不含病毒或其它潜在有害因素的；因此用户应使用业界公认的软件查杀任何自KoinExchange下载文件中的病毒。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.KoinExchange不对用户所发布信息的保存、修改、删除或储存失败负责。对网站上的非因KoinExchange故意所导致的排字错误、疏忽等不承担责任。KoinExchange有权但无义务，改善或更正本网站任何部分之疏漏、错误。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.除非KoinExchange以书面形式明确约定，KoinExchange对于用户以任何方式（包括但不限于包含、经由、连接或下载）从本网站所获得的任何内容信息，包括但不限于广告等，不保证其准确性、完整性、可靠性；对于用户因本网站上的内容信息而购买、获取的任何产品、服务、信息或资料，KoinExchange不承担责任。用户自行承担使用本网站信息内容所导致的风险。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  5.KoinExchange内所有用户所发表的用户评论，仅代表用户个人观点，并不表示本网站赞同其观点或证实其描述，本网站不承担用户评论引发的任何法律责任。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  6.KoinExchange有权删除KoinExchange内各类不符合法律或协议规定的信息，而保留不通知用户的权利。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  7.所有发给用户的通告，KoinExchange都将通过正式的页面公告、站内消息、电子邮件、客服电话、手机短信或常规的信件送达。任何非经KoinExchange正规渠道获得的中奖、优惠等活动或信息，KoinExchange不承担法律责任。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  8.KoinExchange有权根据市场情况调整提现、交易、对冲工具利息等手续费费率，有权决定免费推广期的终止。
  </p>
  <p>
    <br />
  </p>
  <p>
    <b>关于协议</b><b></b>
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.本协议是KoinExchange网与用户注册成为KoinExchange用户，使用KoinExchange服务之间的重要法律文件，KoinExchange或者用户的任何其他书面或者口头意思表示与本协议不一致的，均应当以本协议为准。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.如果本协议的任何条款被视为不合法、无效或因任何原因而无法执行，则此等规定应视为可分割，不影响任何其它条款的法律效力。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.因用户使用KoinExchange而引起或与之相关的一切争议、权利主张或其它事项，均受中华人民共和国法律的管辖。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用户和KoinExchange发生争议的，应首先本着诚信原则通过协商加以解决。如果协商不成，则应向KoinExchange所在地人民法院提起诉讼。
  </p>
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  5.本协议于用户勾选KoinExchange注册页面的网络服务条款并完成注册程序、获得KoinExchange账号和密码时生效，对KoinExchange和用户均具有约束力。
  </p>`;
  }

  private _traditionalChinese(): string{
    return `<p>
    <p>
      通過使用本網站，註冊KoinExchange帳戶或使用我們的任何其他KoinExchange服務，您同意接受並遵守條款和使用條款。在使用本網站或任何KoinExchange服務之前，請仔細閱讀完整的使用條款。本使用條款中使用的「KoinExchange」是指可盈可樂有限公司，包括但不限於其所有者，董事，投資者，員工或其他相關方。根據上下文，「KoinExchange」也可以指服務，產品，網站，內容或其他材料（統稱為「KoinExchange服務」）。若您不接受以下條款，請您立即停止註冊或主動停止使用本網站的服務。根據您所居住的國家/地區，您可能無法使用本網站的所有功能。您有責任遵守您訪問本網站和服務的居住國家和/或國家/地區的這些規則和法律。請注意，KoinExchange有權對本協議進行修改，恕不另行通知補發，請您定期查看本條款，因為您繼續使用該網站將被視為是不可撤銷的接受任何修訂。本條款不涉及KoinExchange用戶與其他用戶之間因比特幣交易而產生的法律關係及法律糾紛。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>接受使用條款</b><b></b>
    </p>
    <p>
      通過使用本網站（「網站」），註冊KoinExchange帳戶（「帳戶」）或使用我們的任何其他KoinExchange服務，您同意接受並遵守條款和使用條款。在使用本網站或任何KoinExchange服務之前，請仔細閱讀完整的使用條款。本使用條款中使用的「KoinExchange」是指可盈可樂有限公司，包括但不限於其所有者，董事，投資者，員工或其他相關方。根據上下文，「KoinExchange」也可以指服務，產品，網站，內容或其他材料（統稱為「KoinExchange服務」）。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>服務內容</b><b></b>
    </p>
    <p>
      1.KoinExchange運用自己的系統，通過互聯網等方式為用戶提供比特幣交易服務。
    </p>
    <p>
      2.用戶提供的註冊資料，用戶同意：
    </p>
    <p>
      （1）提供合法、真實、準確的個人資料；
    </p>
    <p>
      （2）如有變動，及時更新用戶資料。如果用戶提供的註冊資料不合法、不真實、不準確的，用戶需承擔因此引起的相應責任及後果，並且KoinExchange保留終止用戶使用KoinExchange各項服務的權利。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>服務的提供、修改及終止</b><b></b>
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.用戶在接受KoinExchange各項服務的同時，同意接受KoinExchange提供的各類信息服務。用戶在此授權KoinExchange可以向其賬戶、電子郵件、手機等發送商業信息。用戶可進入KoinExchange相關頁面更改聯繫方式。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.KoinExchange保留隨時修改或中斷服務而不需通知用戶的權利，KoinExchange有權行使修改或中斷服務的權利，不需對用戶或任何無直接關係的第三方負責。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.法律允許範圍內，無論在以下何種情況下：信息網絡設備維護、信息網絡連接故障、電腦、通訊或其他系統的故障、電力故障、罷工、勞動爭議、暴亂、起義、騷亂、生產力或生產資料不足、火災、洪水、風暴、爆炸、戰爭、政府行為、司法行政機關的命令、其他不可抗力或第三方的不作為而造成的服務終止或服務延遲以及用戶因此而遭受的損失，KoinExchange不承擔責任。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用戶對本協議的修改有任何異議或對KoinExchange的服務有任何不滿，可以行使以下權利:
    </p>
    <p>
      （1）停止使用KoinExchange的網絡服務。
    </p>
    <p>
      （2）通過客服、支持等渠道告知KoinExchange停止對其服務。結束服務後，用戶使用KoinExchange網絡服務條款的權利立即終止。在此情況下，KoinExchange沒有義務傳送任何未處理的消息或未完成&lt;的服務給用戶或任何無直接關係的第三方。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>用戶信息的保密</b><b></b>
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.本協議所稱之KoinExchange用戶信息是指符合法律、法規及相關規定，並符合下述範圍的信息：
    </p>
    <p>
      （1）用戶註冊KoinExchange時，向KoinExchange提供的個人信息；
    </p>
    <p>
      （2）用戶在使用KoinExchange服務、參加網站活動或訪問網站網頁時，KoinExchange自動接收並記錄的用戶瀏覽器端數據，包括但不限於IP地址、網站Cookie中的資料及用戶要求取用的網頁記錄；
    </p>
    <p>
      （3）KoinExchange從商業夥伴處合法獲取的用戶個人信息；
    </p>
    <p>
      （4）其它KoinExchange通過合法途徑獲取的用戶個人信息。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.KoinExchange承諾未經法定原因或用戶事先許可，KoinExchange不會向任何第三方透露用戶的密碼、姓名、手機號碼、證件號碼等非公開信息。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.在下述法定情況下，用戶的個人信息將會被部分或全部披露。
    </p>
    <p>
      （1）經用戶同意向用戶本人或其他第三方披露；
    </p>
    <p>
      （2）根據法律、法規等相關規定，或行政機構要求，向行政、司法機構或其他法律規定的第三方披露；
    </p>
    <p>
      （3）其他KoinExchange根據法律、法規等相關規定進行的披露。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>用戶權利</b><b></b>
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.用戶的用戶名、密碼和安全性
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （1）用戶名不可重復註冊。用戶名一旦註冊成功，不可更改。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （2）用戶一旦註冊成功，成為KoinExchange的用戶，將得到用戶名（用戶郵箱）和密碼，並對以此組用戶名和密碼登入系統後所發生的所有活動和事件負責，自行承擔一切使用該用戶名發佈的言語、行為等而直接或間接導致的法律責任。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （3）用戶有義務妥善保管KoinExchange賬號、用戶名和密碼、短信驗證碼、谷歌驗證碼，用戶將對用戶名和密碼、和谷歌密鑰安全負全部責任。因用戶原因導致用戶名或密碼、谷歌密鑰洩露而造成的任何法律後果由用戶本人負責，由於用戶自身原因洩露這些信息導致的財產損失，本站不負相關責任。由於KoinExchange是交易網站，登錄密碼、防釣魚碼等不得使用相同密碼，否則會有安全隱患，相關責任由用戶自身承擔。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （4）用戶密碼遺失的，可以通過註冊電子郵箱發送的鏈接重置密碼。用戶若發現任何非法使用用戶名或存在其他安全漏洞的情況，應立即告知KoinExchange。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （5）KoinExchange不會向任何用戶索取密碼，不會讓用戶往任何非本站交易中心裡提供的帳戶、BTC充值地址充值比特幣，請大家不要相信任何非KoinExchange官方發佈的詐騙信息，往非BTC交易中心提供的賬戶、地址里充值比特幣造成的損失本站不負責任。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.用戶有權修改其賬戶個人中心、安全設置中各項可修改信息，自行選擇錄入介紹性文字，自行決定是否提供非必填項的內容；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.用戶有權在KoinExchange瀏覽比特幣的資訊詳情以及交易信息併發表符合國家法律規定、KoinExchange社區規則的文章及觀點；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用戶有權根據網站相關規定，獲得KoinExchange給與的獎勵（如手續費按比例返現等）；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  5.用戶有權按照KoinExchange發佈的活動規則參與KoinExchange組織的各項線上、線下活動（包括各官方平台社區發起的活動）。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  6.用戶有權查看其KoinExchange賬號下的信息。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  7.用戶有權根據KoinExchange網站規定，應用KoinExchange提供的功能進行操作、享受KoinExchange提供的其它各類服務。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>用戶義務</b><b></b>
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.不得利用本站危害國家安全、洩露國家秘密，不得侵犯國家社會集體的和公民的合法權益，不得利用本站製作、複製和傳播下列信息：
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （1）煽動抗拒、破壞憲法和法律、行政法規實施的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （2）煽動顛覆國家政權，推翻社會主義制度的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （3）煽動分裂國家、破壞國家統一的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （4）煽動民族仇恨、民族歧視，破壞民族團結的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （5）捏造或者歪曲事實，散布謠言，擾亂社會秩序的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （6）宣揚封建迷信、淫穢、色情、賭博、暴力、凶殺、恐怖、教唆犯罪的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （7）公然侮辱他人或者捏造事實誹謗他人的，或者進行其他惡意攻擊的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （8）損害國家機關信譽的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （9）其他違反憲法和法律行政法規的；
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  （10）進行商業廣告行為的。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.用戶不得通過任何手段惡意註冊KoinExchange帳號，包括但不限於以牟利、炒作、套現等為目的多個賬號註冊。用戶亦不得盜用其他用戶帳號。如用戶違反上述規定，則KoinExchange有權直接採取一切必要的措施，包括但不限於刪除用戶發佈的內容、取消用戶在網站獲得的星級、榮譽以及虛擬財富，暫停或查封用戶帳號，取消因違規所獲利益，乃至通過訴訟形式追究用戶法律責任等。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.禁止用戶將KoinExchange以任何形式作為從事各種非法活動的場所、平台或媒介。未經KoinExchange的授權或許可，用戶不得借用本站的名義從事任何商業活動，也不得以任何形式將KoinExchange作為從事商業活動的場所、平台或媒介。如用戶違反上述規定，則KoinExchange有權直接採取一切必要的措施，包括但不限於刪除用戶發佈的內容、取消用戶在網站獲得的星級、榮譽以及虛擬財富，暫停或查封用戶帳號，取消因違規所獲利益，乃至通過訴訟形式追究用戶法律責任等。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用戶在KoinExchange以各種形式發佈的一切信息，均應符合國家法律法規等相關規定及網站相關規定，符合社會公序良俗，並不侵犯任何第三方主體的合法權益，否則用戶自行承擔因此產生的一切法律後果，且KoinExchange因此受到的損失，有權向用戶追償。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>拒絕擔保與免責</b><b></b>
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.KoinExchange作為「網絡服務提供者」的第三方平台，不擔保網站平台上的信息及服務能充分滿足用戶的需求。對於用戶在接受KoinExchange的服務過程中可能遇到的錯誤、侮辱、誹謗、不作為、淫穢、色情或褻瀆事件，KoinExchange不承擔法律責任。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.基於互聯網的特殊性，KoinExchange也不擔保服務不會受中斷，對服務的及時性、安全性都不作擔保，不承擔非因KoinExchange導致的責任。KoinExchange力圖使用戶能對本網站進行安全訪問和使用，但KoinExchange不聲明也不保證本網站或其服務器是不含病毒或其它潛在有害因素的；因此用戶應使用業界公認的軟件查殺任何自KoinExchange下載文件中的病毒。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.KoinExchange不對用戶所發佈信息的保存、修改、刪除或儲存失敗負責。對網站上的非因KoinExchange故意所導致的排字錯誤、疏忽等不承擔責任。KoinExchange有權但無義務，改善或更正本網站任何部分之疏漏、錯誤。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.除非KoinExchange以書面形式明確約定，KoinExchange對於用戶以任何方式（包括但不限於包含、經由、連接或下載）從本網站所獲得的任何內容信息，包括但不限於廣告等，不保證其準確性、完整性、可靠性；對於用戶因本網站上的內容信息而購買、獲取的任何產品、服務、信息或資料，KoinExchange不承擔責任。用戶自行承擔使用本網站信息內容所導致的風險。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  5.KoinExchange內所有用戶所發表的用戶評論，僅代表用戶個人觀點，並不表示本網站贊同其觀點或證實其描述，本網站不承擔用戶評論引發的任何法律責任。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  6.KoinExchange有權刪除KoinExchange內各類不符合法律或協議規定的信息，而保留不通知用戶的權利。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  7.所有發給用戶的通告，KoinExchange都將通過正式的頁面公告、站內消息、電子郵件、客服電話、手機短信或常規的信件送達。任何非經KoinExchange正規渠道獲得的中獎、優惠等活動或信息，KoinExchange不承擔法律責任。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  8.KoinExchange有權根據市場情況調整提現、交易、對衝工具利息等手續費費率，有權決定免費推廣期的終止。
    </p>
    <p>
      <br />
    </p>
    <p>
      <b>關於協議</b><b></b>
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  1.本協議是KoinExchange網與用戶註冊成為KoinExchange用戶，使用KoinExchange服務之間的重要法律文件，KoinExchange或者用戶的任何其他書面或者口頭意思表示與本協議不一致的，均應當以本協議為準。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  2.如果本協議的任何條款被視為不合法、無效或因任何原因而無法執行，則此等規定應視為可分割，不影響任何其它條款的法律效力。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  3.因用戶使用KoinExchange而引起或與之相關的一切爭議、權利主張或其它事項，均受中華人民共和國法律的管轄。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  4.用戶和KoinExchange發生爭議的，應首先本著誠信原則通過協商加以解決。如果協商不成，則應向KoinExchange所在地人民法院提起訴訟。
    </p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  5.本協議於用戶勾選KoinExchange註冊頁面的網絡服務條款並完成註冊程序、獲得KoinExchange賬號和密碼時生效，對KoinExchange和用戶均具有約束力。
    </p>
  </p>`;

  }

  private _englishChinese(): string{
    return ``;
  }

}
