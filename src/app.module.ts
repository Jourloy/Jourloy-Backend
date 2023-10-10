import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app/app.controller";
import {AppService} from "./app/app.service";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {ThrottlerModule} from "@nestjs/throttler";
import {AuthMiddleware} from "./middlewares/auth.middleware";
import {PartyModule} from "./party/party.module";
import {TrackerModule} from "./tracker/tracker.module";
import {AdminModule} from "./admin/admin.module";
import {DarkModule} from "./dark/dark.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import { SpendModule } from './spend/spend.module';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 10,
			limit: 50,
		}),

		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: `mongodb://${configService.get<string>(`MONGO_HOST`)}/${configService.get<string>(
					`MONGO_DATABASE`
				)}${process.env.NODE_ENV !== `production` ? `-dev` : `-prod`}`,
			}),
			inject: [ConfigService],
		}),

		AuthModule,
		UserModule,
		PartyModule,
		TrackerModule,
		AdminModule,
		DarkModule,
		SpendModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(`*`);
	}
}
