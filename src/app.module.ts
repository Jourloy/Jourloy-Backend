import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app/app.controller";
import {AppService} from "./app/app.service";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {ThrottlerModule} from "@nestjs/throttler";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthMiddleware} from "./middlewares/auth.middleware";
import {PartyModule} from "./party/party.module";
import { TrackerModule } from './tracker/tracker.module';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 10,
			limit: 50,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: `mongodb://${configService.get<string>(
					`MONGO_HOST`
				)}/${configService.get<string>(`MONGO_DATABASE`)}${
					process.env.NODE_ENV !== `production` ? `-dev` : ``
				}`,
			}),
			inject: [ConfigService],
		}),

		AuthModule,
		UserModule,
		PartyModule,
		TrackerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(`*`);
	}
}
