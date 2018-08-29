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

  conservationObj: any = {};

  constructor() {
    this.initChat();
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
    let _user = localStorage.getItem('user');
    try {
      if (this.realtime && _user) {
        this.user = JSON.parse(_user);

        console.log('### >>> create im client:::', this.user.id);
        this.realtime.createIMClient(String(this.user.id)).then(chat => {
          this.chat = chat;
          this.isLogin = true;
          chat.on(AV.Event.MESSAGE, (message, conversation) => {
            console.log('------------------message: ', message);
            let _from = message.from;
            var _adId = message.getAttributes().for;
            var _avatar = message.getAttributes().avatar;
            var _sendTimestamp = message.getAttributes().sendTimestamp;
            var _text = message.text;
            this.conservationObj[_adId] = this.conservationObj[_adId] || {};
            this.conservationObj[_adId].conversation = conversation;
            this.conservationObj[_adId].chatList = this.conservationObj[_adId].chatList || [];
            this.conservationObj[_adId].chatList.push({
              from: _from,
              content: _text,
              avatar: _avatar,
              sendTimestamp: _sendTimestamp,
              isMe: _from == this.user.id,
            });
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

  getConversation(adId, adUserId): any {
    return new Promise((resolve, reject) => {
      let _conservationObj = this.conservationObj[adId];
      let _conversation = _conservationObj && _conservationObj.conversation || null;
      if (!_conversation) {
        console.log('### >>> conversion not found, create conservation now......');
        _conversation = this.chat.createConversation({
          members: [String(adUserId)],
          name: String(adId),
          transient: false,
          unique: true,
        }).then(conversation => {
          resolve(conversation);
        }, error => {

        });
      } else {
        resolve(_conversation);
      }
    });
  }

  send(adId, adUserId, message): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let conversation: any = await this.getConversation(adId, adUserId);

        if (conversation) {
          console.log('### >>> send message ...');

          const _textMessage = new AV.TextMessage(message);
          _textMessage.setAttributes({
            for: String(adId),
            avatar: this.user.avatar || '',
            sendTimestamp: Date.now(),
          });
          conversation.send(_textMessage);

          this.conservationObj[adId] = this.conservationObj[adId] || {};
          this.conservationObj[adId].conversation = conversation;
          this.conservationObj[adId].chatList = this.conservationObj[adId].chatList || [];
          this.conservationObj[adId].chatList.push({
            from: String(this.user.id),
            content: message,
            avatar: this.user.avatar || '',
            sendTimestamp: Date.now(),
            isMe: true,
          });
          resolve(this.conservationObj[adId].chatList);
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

  updateChatList(adId, adUserId): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let conversation = await this.getConversation(adId, adUserId);
      if (conversation) {
        conversation.queryMessages({limit: 1000})
          .then(messages => {

            this.conservationObj[adId] = this.conservationObj[adId] || {};
            this.conservationObj[adId].conversation = conversation;
            this.conservationObj[adId].chatList = this.conservationObj[adId].chatList || [];

            (messages || []).forEach(message => {
              console.log('message:::::::', message);
              if (!message.getAttributes()) {
                console.log('### >>> message get attribute is null......');
                return;
              }
              let _from = message.from;
              var _adId = message.getAttributes().for;
              var _avatar = message.getAttributes().avatar;
              var _sendTimestamp = message.getAttributes().sendTimestamp;
              var _text = message.text;

              this.conservationObj[adId].chatList.push({
                from: _from,
                content: _text,
                avatar: _avatar,
                sendTimestamp: _sendTimestamp,
                isMe: _from == this.user.id,
              });
            });

            resolve(this.conservationObj[adId].chatList);
            return conversation;
          }).catch(console.error.bind(console));
      }
    });
  }
}
