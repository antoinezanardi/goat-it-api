import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DatabaseService } from "@src/infrastructure/database/providers/database.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: DatabaseService,
    }),
  ],
})

export class DatabaseModule {}