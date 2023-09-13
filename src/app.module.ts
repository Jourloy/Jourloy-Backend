import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app/app.controller";
import {AppService} from "./app/app.service";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {ThrottlerModule} from "@nestjs/throttler";
import {AuthMiddleware} from "./middlewares/auth.middleware";
import {PartyModule} from "./party/party.module";
import { TrackerModule } from './tracker/tracker.module';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 10,
			limit: 50,
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
