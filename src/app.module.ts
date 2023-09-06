import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfiguration } from './config/app.config';
import { ModelService } from './model/model.service';
import { FileProcessingService } from './file_processing/file_processing.service';
import { FilesService } from './files/files.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql_host'),
        port: +configService.get('mysql_port'),
        username: configService.get('mysql_username'),
        password: configService.get('mysql_password'),
        database: configService.get('mysql_database'),
        entities: [],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ModelService, FileProcessingService, FilesService],
})
export class AppModule {}
