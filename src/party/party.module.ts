import {Module} from "@nestjs/common";
import {PartyService} from "./party.service";
import {PartyController} from "./party.controller";
import { PrismaModule } from "src/database/prisma.module";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [PartyController],
	providers: [PartyService],
})
export class PartyModule {}
