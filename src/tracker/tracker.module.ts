import {Module} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {TrackerController} from "./tracker.controller";
import {PrismaModule} from "src/database/prisma.module";
import {UserModule} from "src/user/user.module";

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [TrackerController],
	providers: [TrackerService],
	exports: [TrackerService],
})
export class TrackerModule {}
