import {Module} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {TrackerController} from "./tracker.controller";
import {UserModule} from "src/user/user.module";
import {PrismaModule} from "src/database/prisma.module";

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [TrackerController],
	providers: [TrackerService],
})
export class TrackerModule {}
