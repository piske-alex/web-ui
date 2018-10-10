import { Injectable } from '@angular/core';

const AV = (<any>window).AV;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: any;
  realtime: any;
  chat: any;
  isLogin = false;
  currentLoginUserId: number;

  conservationObj: any = {};

  receive: Function;

  chat_topic_keyword: string;

  constructor() {
    this.initChat();
    this.chat_topic_keyword = 'koin';
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

  loginChat() {
    console.log('### >>> loginChat:::', this.isLogin);
    if (this.isLogin) {
      return;
    }
    const _user = localStorage.getItem('user');
    try {
      if (this.realtime && _user) {
        this.user = JSON.parse(_user);
        this.currentLoginUserId = this.user.id;

        console.log('### >>> create im client:::', this.user.id);
        this.realtime.createIMClient(String(this.user.id)).then(chat => {
          this.chat = chat;
          this.isLogin = true;
          chat.on(AV.Event.MESSAGE, (message, conversation) => {
            console.log('------------------message: ', message);
            const _from = message.from;
            const _adId = message.getAttributes().for;
            const _adUserId = message.getAttributes().adUserId;
            const _anotherUserId = message.getAttributes().anotherUserId;
            const _avatar = message.getAttributes().avatar;
            const _sendTimestamp = message.getAttributes().sendTimestamp;
            const _text = message.text;

            let chat_union_ids = '';
            if (Number(_adUserId) > Number(_anotherUserId)) {
              chat_union_ids = String(_adUserId) + '_' + String(_anotherUserId) + '_' + String(_adId);
            } else {
              chat_union_ids = String(_anotherUserId) + '_' + String(_adUserId) + '_' + String(_adId) ;
            }

            this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
            this.conservationObj[chat_union_ids].conversation = conversation;
            this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];
            this.conservationObj[chat_union_ids].chatList.push({
              from: _from,
              content: _text,
              avatar: _avatar,
              sendTimestamp: _sendTimestamp,
              isMe: _from == this.user.id,
            });
            if (this.receive) {
              this.receive();
            }
          });
        }).catch(console.error);
      } else {
        console.log('### >>> realtime or user is null');
        setTimeout(() => {
          this.loginChat();
        }, 5000);
      }
    } catch (e) {
      console.error(e);
    }
  }

  loginChatTest(loginUserId: number) {
    console.log('### >>> loginChat:::', this.isLogin);
    if (this.isLogin) {
      return;
    }
    const _user = localStorage.getItem('user');
    try {
      if (this.realtime && _user) {
        this.user = JSON.parse(_user);
        this.currentLoginUserId = this.user.id;

        console.log('### >>> create im client:::', this.user.id);
        this.realtime.createIMClient(String(this.user.id)).then(chat => {
          this.chat = chat;
          this.isLogin = true;
          chat.on(AV.Event.MESSAGE, (message, conversation) => {
            console.log('------------------message: ', message);
            const _from = message.from;
            const _adId = message.getAttributes().for;
            const _adUserId = message.getAttributes().adUserId;
            const _anotherUserId = message.getAttributes().anotherUserId;
            const _orderId = message.getAttributes().orderId;
            const _avatar = message.getAttributes().avatar;
            const _sendTimestamp = message.getAttributes().sendTimestamp;
            const _text = message.text;

            let chat_union_ids = '';
            if (Number(_adUserId) > Number(_anotherUserId)) {
              chat_union_ids = String(_adUserId) + '_' + String(_anotherUserId) + '_' + String(_adId);
            } else {
              chat_union_ids = String(_anotherUserId) + '_' + String(_adUserId) + '_' + String(_adId) ;
            }

            this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
            this.conservationObj[chat_union_ids].conversation = conversation;
            this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];
            this.conservationObj[chat_union_ids].chatList.push({
              from: _from,
              content: _text,
              avatar: _avatar,
              sendTimestamp: _sendTimestamp,
              isMe: _from == this.user.id,
            });

            console.log('conservationObj======', this.conservationObj);
            if (this.receive) {
              this.receive();
            }
          });

          // chat.on(AV.Event.UNREAD_MESSAGES_COUNT_UPDATE, function(conversations) {
          //   for (let conv of conversations) {
          //     console.log(conv.id, conv.name, conv.unreadMessagesCount);
          //   }
          // });

        }).catch(console.error);
      } else {
        console.log('### >>> realtime or user is null');
        setTimeout(() => {
          this.loginChat();
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
      // let memberTo = anotherUserId;
      // if (this.currentLoginUserId === anotherUserId) {
      //   memberTo = adUserId;
      // }

      const _conservationObj = this.conservationObj[chat_union_ids];
      let _conversation = _conservationObj && _conservationObj.conversation || null;
      if (!_conversation) {
        console.log('### >>> conversion not found, create conservation now......', chat_union_ids);
         _conversation =
        this.chat.createConversation({
          members: [String(adUserId), String(anotherUserId)],
          name: String(chat_union_ids),
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

  loginAndGetChatDialogList(): Promise<any> {
    if (this.isLogin && this.chat) {
      const _user = localStorage.getItem('user');
      this.user = JSON.parse(_user);
      this.currentLoginUserId = this.user.id;

      return new Promise((resolve, reject) => {
        console.log('currentLoginUserId11', this.currentLoginUserId);

         this.chat.getQuery()
        .containsMembers([String(this.currentLoginUserId)])
        .limit(50)
        .withLastMessagesRefreshed(true)
        // .contains('topic', this.chat_topic_keyword)
        .find()
        .then(function(conversations) {
          resolve(conversations);
          // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
          // conversations.map(function(conversation) {
          //   console.log('1111', conversation);
          // });
        }).catch(console.error.bind(console));
       });
    } else {
      const _user = localStorage.getItem('user');
      this.user = JSON.parse(_user);
      this.currentLoginUserId = this.user.id;

      return new Promise((resolve, reject) => {
        this.realtime.createIMClient(String(this.user.id)).then(chat => {
          this.chat = chat;
          this.isLogin = true;

          this.chat.getQuery()
            .containsMembers([String(this.currentLoginUserId)])
            .limit(50)
            .withLastMessagesRefreshed(true)
            // .contains('topic', this.chat_topic_keyword)
            .find()
            .then(function(conversations) {
              resolve(conversations);
              // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
              // conversations.map(function(conversation) {
              //   console.log('1111', conversation);
              // });
            }).catch(console.error.bind(console));

        });

      });
    }

  }




  send(adId, adUserId, anotherUserId, orderId, message): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const conversation: any = await this.getConversationLocal(adId, adUserId, anotherUserId);
        let chat_union_ids = '';
        if (Number(adUserId) > Number(anotherUserId)) {
          chat_union_ids = String(adUserId) + '_' + String(anotherUserId) + '_' + String(adId) ;
        } else {
          chat_union_ids = String(anotherUserId) + '_' + String(adUserId) + '_' + String(adId) ;
        }
        if (conversation) {
          console.log('### >>> send message ...', chat_union_ids);

          const _textMessage = new AV.TextMessage(message);
          _textMessage.setAttributes({
            for: String(adId),
            adUserId: String(adUserId),
            anotherUserId: String(anotherUserId),
            orderId: String(orderId),
            topic: this.chat_topic_keyword,
            avatar: this.user.avatar || '',
            sendTimestamp: Date.now(),
          });
          conversation.send(_textMessage);
          console.log('### >>> send message ...', _textMessage);
          this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
          this.conservationObj[chat_union_ids].conversation = conversation;
          this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];
          this.conservationObj[chat_union_ids].chatList.push({
            from: String(this.user.id),
            content: message,
            avatar: this.user.avatar || '',
            sendTimestamp: Date.now(),
            isMe: true,
          });
          resolve(this.conservationObj[chat_union_ids].chatList);
          console.log('### >>> send message ...end');
          return conversation;
        } else {
          console.log('### >>> not found conversaction or create failed!!!');
          reject('### >>> not found conversaction or create failed!!!');
        }
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  updateChatList(adId, adUserId, anotherUserId, orderId): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const conversation = await this.getConversationLocal(adId, adUserId, anotherUserId);
      if (conversation) {
        conversation.queryMessages({limit: 500})
          .then(messages => {
            let chat_union_ids = '';
            if (Number(adUserId) > Number(anotherUserId)) {
              chat_union_ids = String(adUserId) + '_' + String(anotherUserId) + '_' + String(adId) ;
            } else {
              chat_union_ids = String(anotherUserId) + '_' + String(adUserId)  + '_' + String(adId);
            }

            this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
            this.conservationObj[chat_union_ids].conversation = conversation;
            this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];

            this.conservationObj[chat_union_ids].chatList = [];
            (messages || []).forEach(message => {
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

              this.conservationObj[chat_union_ids].chatList.push({
                from: _from,
                content: _text,
                avatar: _avatar,
                sendTimestamp: _sendTimestamp,
                isMe: _from == this.user.id,
              });
            });
            console.log('message::conversation:::::', conversation);
            console.log('message::count:::::', messages.length);
            console.log('message::this.user.id:::::', this.user.id);

            resolve(this.conservationObj[chat_union_ids].chatList);

            // 进入到对话页面时标记其为已读
            conversation.read().then(function(conversation2) {
              console.log('对话已标记为已读');
            }).catch(console.error.bind(console));

             return conversation;
          }).catch(console.error.bind(console));
      }
    });
  }

  closeChatClient() {
    this.isLogin = false;
    // this.chat.close().then(function() {  }).catch(console.error.bind(console));
  }







}
