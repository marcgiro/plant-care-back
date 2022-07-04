import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantsModule } from './plants/plants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, PlantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
