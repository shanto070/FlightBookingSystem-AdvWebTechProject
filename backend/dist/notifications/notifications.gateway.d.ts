import { OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
export declare class NotificationsGateway implements OnGatewayConnection {
    server: Server;
    handleConnection(_client: Socket): void;
    handleJoinRoom(client: Socket, payload: {
        userId: number;
    }): void;
    sendBookingCreated(userId: number, payload: unknown): void;
    sendBookingStatusUpdated(userId: number, payload: unknown): void;
    sendFlightScheduleChanged(userId: number, payload: unknown): void;
}
