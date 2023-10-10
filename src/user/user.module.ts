import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {PrismaModule} from "src/database/prisma.module";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./schemas/user.schema";

@Module({
	imports: [PrismaModule, MongooseModule.forFeature([{name: `User`, schema: UserSchema}])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
