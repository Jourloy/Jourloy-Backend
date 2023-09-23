import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {GoogleStrategy} from "./strategies/google.strategy";
import {UserModule} from "../user/user.module";

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		GoogleStrategy,
	],
})
export class AuthModule {}
