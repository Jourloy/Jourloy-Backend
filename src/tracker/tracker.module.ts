import {Module} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {TrackerController} from "./tracker.controller";
import {UserModule} from "src/user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {TrackerSchema} from "./schemas/tracker.schema";

@Module({
	imports: [MongooseModule.forFeature([{name: `Tracker`, schema: TrackerSchema}]), UserModule],
	controllers: [TrackerController],
	providers: [TrackerService],
})
export class TrackerModule {}
