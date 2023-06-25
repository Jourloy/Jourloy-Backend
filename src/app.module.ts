import {Module} from "@nestjs/common";
import {AppController} from "./app/app.controller";
import {AppService} from "./app/app.service";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {ThrottlerModule} from "@nestjs/throttler";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { SpendModule } from './spend/spend.module';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: `mongodb://${configService.get<string>(
					`MONGO_HOST`
				)}/${configService.get<string>(`MONGO_DATABASE`)}-dev`,
			}),
			inject: [ConfigService],
		}),

		AuthModule,
		UserModule,
		SpendModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
