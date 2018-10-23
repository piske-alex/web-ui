import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const AV = (<any>window).AV;

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.scss']
})
export class ChatingComponent implements OnInit {

  orderId: string;
  order: any = {};

  adId: string;
  adUserId: string;
  anotherUserId: string;

  loginUserId: number ;

  chatingList: any[] = [];

  user: any;
  realtime: any;
  chat: any;
  isLogin = false;

  conservationObj: any = {};

  receive: Function;

  chat_topic_keyword: string;


  constructor(private route: ActivatedRoute) {
    this.initChat();
    this.chat_topic_keyword = 'dev02';
  }

  async ngOnInit() {

    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adUserId = this.route.snapshot.paramMap.get('adUserId');
    this.anotherUserId = this.route.snapshot.paramMap.get('anotherUserId');
    this.orderId = this.route.snapshot.paramMap.get('orderId');

    this.loginChat(this.adId, this.adUserId, this.anotherUserId, this.orderId);

    setTimeout(() => {
      this.refreshchatlist();
    }, 1000);

  }


  async refreshchatlist() {
    // this.chatingList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId, this.orderId);

  }


  initChat() {
    if (this.realtime) {
      return;
    }
    this.realtime = new AV.Realtime({
      appId: 'SLDdimkCsvFh1R5xlreorNl0-gzGzoHsz',
      appKey: 'Pd10DELIIqFQkIkNJdv490IW',
      region: 'cn', // 美国节点为 "us"
    });

  }

 async loginChat(adId, adUserId, anotherUserId, orderId) {
    console.log('### >>> loginChat:::', this.isLogin);
   if (this.isLogin) {
     return;
   }
   const chat_top = this.chat_topic_keyword;

   try {
     if (this.realtime ) {

       this.realtime.createIMClient(String(adUserId)).then(async chat => {
         this.chat = chat;
         this.isLogin = true;

         const conversation = await this.getConversationLocal(adId, adUserId, anotherUserId);

         if (conversation) {
           conversation.queryMessages({limit: 1000})
             .then(messageses => {
               let chat_union_ids = '';
               if (Number(adUserId) > Number(anotherUserId)) {
                 chat_union_ids = String(adUserId) + '_' + String(anotherUserId) + '_' + String(adId) ;
               } else {
                 chat_union_ids = String(anotherUserId) + '_' + String(adUserId)  + '_' + String(adId);
               }

               this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
               this.conservationObj[chat_union_ids].conversation = conversation;
               // this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];

               this.conservationObj[chat_union_ids].chatList = [];
               (messageses || []).forEach(message => {
                 // console.log('message:::::::', message);
                 if (!message.getAttributes()) {
                   console.log('### >>> message get attribute is null......');
                   return;
                 }
                 const _from = message.from;
                 const _adId = message.getAttributes().for;
                 const _avatar = message.getAttributes().avatar;
                 const _sendTimestamp = message.getAttributes().sendTimestamp;
                 const _text = message.text;
                 const _adUserName = message.getAttributes().adUserName;
                 const _anotherUserName = message.getAttributes().anotherUserName;
                 const _adUserId = message.getAttributes().adUserId;
                 const _anotherUserId = message.getAttributes().anotherUserId;
                 const _topic = message.getAttributes().topic;

                 if (_topic && _topic == chat_top ) {
                   this.conservationObj[chat_union_ids].chatList.push({
                     from: _from,
                     content: _text,
                     avatar: _avatar,
                     sendTimestamp: _sendTimestamp,
                     isMe: _from == _anotherUserId,
                     adUserName : _adUserName,
                     anotherUserName : _anotherUserName,
                     adUserId : _adUserId,
                     anotherUserId : _anotherUserId
                   });
                 }
               });
               // console.log('message::conversation:::::', conversation);
               // console.log('message::count:::::', messages.length);
               // console.log('message::this.user.id:::::', this.user.id);


               this.chatingList = this.conservationObj[chat_union_ids].chatList;

               console.log('messages', this.chatingList);

             }).catch(console.error.bind(console));
         }


       }).catch(console.error);
     } else {
       console.log('### >>> realtime or user is null');
       setTimeout(() => {
         this.loginChat(this.adId, this.adUserId, this.anotherUserId, this.orderId);
       }, 5000);
     }
   } catch (e) {
     console.error(e);
   }
 }


 getConversationLocal(adId, adUserId, anotherUserId): any {
  return new Promise((resolve, reject) => {
    let chat_union_ids = '';
    if (Number(adUserId) > Number(anotherUserId)) {
      chat_union_ids = String(adUserId) + '_' + String(anotherUserId) + '_' + String(adId);
    } else {
      chat_union_ids = String(anotherUserId) + '_' + String(adUserId) + '_' + String(adId) ;
    }

    const _conservationObj = this.conservationObj[chat_union_ids];
    let _conversation = _conservationObj && _conservationObj.conversation || null;
    if (!_conversation) {
      // console.log('### >>> conversion not found, create conservation now......', chat_union_ids);
       _conversation =
      this.chat.createConversation({
        members: [String(adUserId), String(anotherUserId), String(chat_union_ids) + '_' + this.chat_topic_keyword],
        name: String(chat_union_ids) + '_' + this.chat_topic_keyword,
        transient: false,
        unique: true,
      }).then(conversation => {
        resolve(conversation);
      }, error => {
        console.error.bind(console);
      });
    } else {
      resolve(_conversation);
    }
  });
}





}
