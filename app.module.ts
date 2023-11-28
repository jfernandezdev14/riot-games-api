import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LolController } from './src/modules/lol/lol.controller';
import { LolModule } from './src/modules/lol/lol.module';
import { AppController } from './src/app.controller';
import { AppService } from './src/app.service';
import { DatabaseModule } from './db/database.module';
@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, LolModule],
  controllers: [LolController, AppController],
  providers: [AppService, ConfigService],
  exports: [AppService],
})
export class AppModule {}
