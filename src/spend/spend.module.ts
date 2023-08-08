import {Module} from "@nestjs/common";
import {SpendService} from "./spend.service";
import {SpendController} from "./spend.controller";
import {UserModule} from "src/user/user.module";
import {TrackerModule} from "src/tracker/tracker.module";
import {PrismaModule} from "src/database/prisma.module";

@Module({
	imports: [PrismaModule, TrackerModule, UserModule],
	controllers: [SpendController],
	providers: [SpendService],
})
export class SpendModule {}
