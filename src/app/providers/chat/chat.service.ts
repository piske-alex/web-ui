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
  unreadTip: Function;

  chat_topic_keyword: string;

  constructor() {
    this.initChat();
    this.chat_topic_keyword = '_dev01';
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
    const chat_top = this.chat_topic_keyword;
    const _user = localStorage.getItem('user');
    try {
      if (this.realtime && _user) {
        this.user = JSON.parse(_user);
        this.currentLoginUserId = this.user.id;

         console.log('### >>> create im client:::', this.user);
        this.realtime.createIMClient(String(this.user.id) + this.chat_topic_keyword).then(chat => {
          this.chat = chat;
          this.isLogin = true;
          console.log('chat info:' , chat);
          // chat.on(AV.Event.MESSAGE, (message, conversation) => {
          //    console.log('--loginChat--------3333--------message: ', message);
          //   const _from = message.from;
          //   const _adId = message.getAttributes().for;
          //   const _adUserId = message.getAttributes().adUserId;
          //   const _anotherUserId = message.getAttributes().anotherUserId;
          //   const _avatar = message.getAttributes().avatar;
          //   const _sendTimestamp = message.getAttributes().sendTimestamp;
          //   const _text = message.text;

          //   let chat_union_ids = '';
          //   if (Number(_adUserId) > Number(_anotherUserId)) {
          //     chat_union_ids = String(_adUserId) + '_' + String(_anotherUserId) + '_' + String(_adId);
          //   } else {
          //     chat_union_ids = String(_anotherUserId) + '_' + String(_adUserId) + '_' + String(_adId) ;
          //   }

          //   this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
          //   this.conservationObj[chat_union_ids].conversation = conversation;
          //   this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];

          //   const _topic = message.getAttributes().topic;

          //     if (_topic && _topic == chat_top ) {
          //       this.conservationObj[chat_union_ids].chatList.push({
          //         from: _from,
          //         content: _text,
          //         avatar: _avatar,
          //         sendTimestamp: _sendTimestamp,
          //         isMe: _from == this.user.id,
          //       });
          //    }

          //   if (this.receive) {
          //     this.receive();
          //   }
          // });

          chat.on(AV.UNREAD_MESSAGES_COUNT_UPDATE, function(unreadconversations) {
            console.log('chat service  UNREAD_MESSAGES_COUNT_UPDATE');
            if (this.unreadTip) {
              console.log('chat service  UNREAD_MESSAGES_COUNT_UPDATE  proces');
              this.unreadTip();
            }
          });

        }).catch(console.error);
      } else {
        console.log('### >>> realtime or user is null');
        setTimeout(() => {
          this.loginChat();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      setTimeout(() => {
        this.loginChat();
      }, 2000);
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
          members: [(String(adUserId) + this.chat_topic_keyword),
            (String(anotherUserId) + this.chat_topic_keyword),
            String(chat_union_ids) + '_' + this.chat_topic_keyword],
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

  loginAndGetChatDialogList(): Promise<any> {
    console.log('--------------loginAndGetChatDialogList----: ');
    if (this.isLogin && this.chat) {
      console.log('--------------loginAndGetChatDialogList----if: ');
      const _user = localStorage.getItem('user');
      this.user = JSON.parse(_user);
      this.currentLoginUserId = this.user.id;

      return new Promise((resolve, reject) => {
        this.realtime.createIMClient(String(this.user.id) + this.chat_topic_keyword).then(chat => {
          this.chat = chat;
          this.isLogin = true;

          // chat.on(AV.Event.MESSAGE, (message, conversation) => {
          //   console.log('-----loginAndGetChatDialogList---------111----message: ', message);
          //   const _from = message.from;
          //   const _adId = message.getAttributes().for;
          //   const _adUserId = message.getAttributes().adUserId;
          //   const _anotherUserId = message.getAttributes().anotherUserId;
          //   const _avatar = message.getAttributes().avatar;
          //   const _sendTimestamp = message.getAttributes().sendTimestamp;
          //   const _text = message.text;

          //   let chat_union_ids = '';
          //   if (Number(_adUserId) > Number(_anotherUserId)) {
          //     chat_union_ids = String(_adUserId) + '_' + String(_anotherUserId) + '_' + String(_adId);
          //   } else {
          //     chat_union_ids = String(_anotherUserId) + '_' + String(_adUserId) + '_' + String(_adId) ;
          //   }

          //   this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
          //   this.conservationObj[chat_union_ids].conversation = conversation;
          //   this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];
          //   this.conservationObj[chat_union_ids].chatList.push({
          //     from: _from,
          //     content: _text,
          //     avatar: _avatar,
          //     sendTimestamp: _sendTimestamp,
          //     isMe: _from == this.user.id,
          //   });
          //   if (this.receive) {
          //     this.receive();
          //   }
          // });
          // console.log('currentLoginUserId11', this.user.id);
          // console.log('topic keyword', this.chat_topic_keyword);
          const chat_top = this.chat_topic_keyword;
          this.chat.getQuery()
            .containsMembers([(String(this.currentLoginUserId) + this.chat_topic_keyword)])
            .limit(100)
            .withLastMessagesRefreshed(true)
            .find()
            .then(function(conversations) {

              let chats: Array<any> = new Array();
              conversations.map(function(chat) {
                if (chat) {
                  if (chat.lastMessage) {
                    if (chat.lastMessage._lcattrs) {
                      if (chat.lastMessage._lcattrs.topic == chat_top) {
                        chats.push(chat);
                      }
                    }
                  }
                }
              });

              resolve(chats);
              // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
              // conversations.map(function(conversation) {
              //   console.log('1111', conversation);
              // });
            }).catch(console.error.bind(console));

        });

      });

    } else {
      console.log('--------------loginAndGetChatDialogList----else: ');
      const _user = localStorage.getItem('user');
      this.user = JSON.parse(_user);
      this.currentLoginUserId = this.user.id;

      return new Promise((resolve, reject) => {
        this.realtime.createIMClient(String(this.user.id) + this.chat_topic_keyword).then(chat => {
          this.chat = chat;
          this.isLogin = true;

          // chat.on(AV.Event.MESSAGE, (message, conversation) => {
          //   console.log('-----loginAndGetChatDialogList------22222-------message: ', message);
          //   const _from = message.from;
          //   const _adId = message.getAttributes().for;
          //   const _adUserId = message.getAttributes().adUserId;
          //   const _anotherUserId = message.getAttributes().anotherUserId;
          //   const _avatar = message.getAttributes().avatar;
          //   const _sendTimestamp = message.getAttributes().sendTimestamp;
          //   const _text = message.text;

          //   let chat_union_ids = '';
          //   if (Number(_adUserId) > Number(_anotherUserId)) {
          //     chat_union_ids = String(_adUserId) + '_' + String(_anotherUserId) + '_' + String(_adId);
          //   } else {
          //     chat_union_ids = String(_anotherUserId) + '_' + String(_adUserId) + '_' + String(_adId) ;
          //   }

          //   this.conservationObj[chat_union_ids] = this.conservationObj[chat_union_ids] || {};
          //   this.conservationObj[chat_union_ids].conversation = conversation;
          //   this.conservationObj[chat_union_ids].chatList = this.conservationObj[chat_union_ids].chatList || [];
          //   this.conservationObj[chat_union_ids].chatList.push({
          //     from: _from,
          //     content: _text,
          //     avatar: _avatar,
          //     sendTimestamp: _sendTimestamp,
          //     isMe: _from == this.user.id,
          //   });
          //   if (this.receive) {
          //     this.receive();
          //   }
          // });

          // console.log('currentLoginUserId22', this.chat_topic_keyword);
          const chat_top = this.chat_topic_keyword;
          this.chat.getQuery()
            .containsMembers([(String(this.currentLoginUserId)+ + this.chat_topic_keyword)])
            .limit(100)
            .withLastMessagesRefreshed(true)
            .find()
            .then(function(conversations) {

              let chats: Array<any> = new Array();
              conversations.map(function(chat) {
                if (chat) {
                  if (chat.lastMessage) {
                    if (chat.lastMessage._lcattrs) {
                      if (chat.lastMessage._lcattrs.topic == chat_top) {
                        chats.push(chat);
                      }
                    }
                  }
                }
              });

              resolve(chats);
              // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
              // conversations.map(function(conversation) {
              //   console.log('1111', conversation);
              // });
            }).catch(console.error.bind(console));

        });

      });
    }

  }




  send(adId, adUserId, anotherUserId, orderId, message, adUserName , anotherUserName): Promise<any> {
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
          // console.log('### >>> send message ...', chat_union_ids);

          const _textMessage = new AV.TextMessage(message);
          _textMessage.setAttributes({
            for: String(adId),
            adUserId: String(adUserId),
            anotherUserId: String(anotherUserId),
            adUserName: String(adUserName),
            anotherUserName: String(anotherUserName),
            orderId: String(orderId),
            topic: this.chat_topic_keyword,
            avatar: this.user.avatar || '',
            sendTimestamp: Date.now(),
          });
          conversation.send(_textMessage);
           // console.log('### >>> send message ...', _textMessage);
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
          // console.log('### >>> send message ...end');
          // return conversation;
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

    const chat_top = this.chat_topic_keyword;

    return new Promise(async (resolve, reject) => {
      const conversation = await this.getConversationLocal(adId, adUserId, anotherUserId);

      if (conversation) {
        conversation.queryMessages({limit: 1000})
          // .contains('topic', this.chat_topic_keyword)
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
               console.log('message:::::::', message);
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
              const _topic = message.getAttributes().topic;

              if (_topic && _topic == chat_top ) {
                this.conservationObj[chat_union_ids].chatList.push({
                  from: _from,
                  content: _text,
                  avatar: _avatar,
                  sendTimestamp: _sendTimestamp,
                  isMe: _from == (String(this.user.id) + this.chat_topic_keyword),
                });
              }
            });
            // console.log('message::conversation:::::', conversation);
            // console.log('message::count:::::', messages.length);
            // console.log('message::this.user.id:::::', this.user.id);

            // 进入到对话页面时标记其为已读
            conversation.read().then(function(conversation2) {
              // console.log('对话已标记为已读');
            }).catch(console.error.bind(console));

            resolve(this.conservationObj[chat_union_ids].chatList);

          }).catch(console.error.bind(console));
      }
    });
  }


  getUnreadCount(): Promise<any> {
    const _user = localStorage.getItem('user');
    if (_user == undefined) {
      return new Promise((resolve, reject) => { resolve(0); });
    }
    this.user = JSON.parse(_user);
    if (this.user.id == undefined) {
      return new Promise((resolve, reject) => { resolve(0); });
    }
    this.currentLoginUserId = this.user.id;

    if (this.isLogin && this.chat) {
     // console.log('--------------getUnreadCount----if had login: ');

      return new Promise((resolve, reject) => {
        this.realtime.createIMClient(String(this.user.id) + this.chat_topic_keyword).then(chat => {
          this.chat = chat;
          this.isLogin = true;

          const chat_top = this.chat_topic_keyword;
          this.chat.getQuery()
            .containsMembers([(String(this.currentLoginUserId) + this.chat_topic_keyword)])
            .limit(100)
            .withLastMessagesRefreshed(true)
            .find()
            .then(function(conversations) {

              let unreadCountSum = 0;
              let chats: Array<any> = new Array();
              conversations.map(function(chat) {
                if (chat) {
                  if (chat.lastMessage) {
                    if (chat.lastMessage._lcattrs) {
                      if (chat.lastMessage._lcattrs.topic == chat_top) {
                        // chats.push(chat);
                        unreadCountSum = unreadCountSum + chat.unreadMessagesCount;
                      }
                    }
                  }
                }
              });

              resolve(unreadCountSum);

            }).catch(console.error.bind(console));

        });

      });

    } else {
      // console.log('--------------getUnreadCount----else not login: ');

      return new Promise((resolve, reject) => {
        this.realtime.createIMClient(String(this.user.id) + this.chat_topic_keyword).then(chat => {
         this.chat = chat;
          this.isLogin = true;
          const chat_top = this.chat_topic_keyword;
          this.chat.getQuery()
            .containsMembers([(String(this.currentLoginUserId) + this.chat_topic_keyword)])
            .limit(100)
            .withLastMessagesRefreshed(true)
            .find()
            .then(function(conversations) {

              let unreadCountSum = 0;
              let chats: Array<any> = new Array();
              conversations.map(function(chat) {
                if (chat) {
                  if (chat.lastMessage) {
                    if (chat.lastMessage._lcattrs) {
                      if (chat.lastMessage._lcattrs.topic == chat_top) {
                        // chats.push(chat);
                        unreadCountSum = unreadCountSum + chat.unreadMessagesCount;
                      }
                    }
                  }
                }
              });

              resolve(unreadCountSum);

            }).catch(console.error.bind(console));

        });

      });
    }

  }


  closeChatClient() {
    this.isLogin = false;
    // console.log('closeChatClient');
    if (this.chat) {
      this.chat.close().then(function() {  }).catch(console.error.bind(console));
    }
  }







}
