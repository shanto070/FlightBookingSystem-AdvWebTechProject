import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(_client: Socket) {}

  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, payload: { userId: number }) {
    if (payload?.userId) {
      client.join(`user_${payload.userId}`);
      client.emit('joined_room', { room: `user_${payload.userId}` });
    }
  }

  sendBookingCreated(userId: number, payload: unknown) {
    this.server.to(`user_${userId}`).emit('booking_created', payload);
  }

  sendBookingStatusUpdated(userId: number, payload: unknown) {
    this.server.to(`user_${userId}`).emit('booking_status_updated', payload);
  }

  sendFlightScheduleChanged(userId: number, payload: unknown) {
    this.server.to(`user_${userId}`).emit('flight_schedule_changed', payload);
  }
}
