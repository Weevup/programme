import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { VenuesModule } from './venues/venues.module';
import { SessionsModule } from './sessions/sessions.module';
import { ParticipantsModule } from './participants/participants.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    EventsModule,
    VenuesModule,
    SessionsModule,
    ParticipantsModule,
  ],
})
export class AppModule {}
