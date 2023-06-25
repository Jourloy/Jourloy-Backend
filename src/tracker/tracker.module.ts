import {Module} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {TrackerController} from "./tracker.controller";

@Module({
	imports: [],
	controllers: [TrackerController],
	providers: [TrackerService],
})
export class TrackerModule {}
