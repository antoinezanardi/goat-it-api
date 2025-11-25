import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "nestjs-pino";

import { DatabaseService } from "@src/infrastructure/database/providers/database.service";

@Module({
  imports: [
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: DatabaseService,
    }),
  ],
})

export class DatabaseModule {}