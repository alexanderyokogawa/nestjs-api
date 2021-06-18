import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://nestjs:nestjs@clusteralexmaxdev.ex4ok.mongodb.net/test\n',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
