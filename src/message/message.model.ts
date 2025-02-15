import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ChatModel } from 'src/chat/chat.model';

import { UserModel } from 'src/user/user.model';
import { MessageType } from './message.interface';

export interface MessageModel extends Base {}

export class MessageModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  senderId: Ref<UserModel>;

  @prop({ ref: () => ChatModel })
  chatId: Ref<ChatModel>;

  @prop({ enum: ['text', 'file'] })
  type: MessageType;

  @prop({ required: false })
  fileUrl?: string;

  @prop({ required: false })
  text?: string;
}
