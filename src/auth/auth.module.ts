import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {GoogleStrategy} from "./strategies/google.strategy";
import {ThrottlerGuard} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {UserModule} from "../user/user.module";

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		GoogleStrategy,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AuthModule {}
