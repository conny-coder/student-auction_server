import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { MessageService } from 'src/message/message.service';
import { MessageType } from 'src/message/message.interface';
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  afterInit(server: Server) {
    console.log('Socket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      chatId: string;
      senderId: string;
      text?: string;
      fileUrl?: string;
      type: MessageType;
    },
  ) {
    const { chatId, senderId, text, type, fileUrl } = data;

    if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(senderId)) {
      throw new BadRequestException('Невірний формат chatId або senderId');
    }

    if (!text && !fileUrl) {
      throw new BadRequestException(
        'Повідомлення повинно містити текст або файл',
      );
    }

    const message = await this.messageService.create(
      new Types.ObjectId(senderId),
      {
        chatId: new Types.ObjectId(chatId),
        type,
        text,
        fileUrl,
      },
    );

    this.server.to(chatId).emit('newMessage', message);

    return message;
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatId);
    console.log(`User joined chat ${chatId}`);
  }
}
