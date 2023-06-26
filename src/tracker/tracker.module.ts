import {Module} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {TrackerController} from "./tracker.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Tracker, TrackerSchema} from "./schemas/tracker.schema";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [MongooseModule.forFeature([{name: Tracker.name, schema: TrackerSchema}]), UserModule],
	controllers: [TrackerController],
	providers: [TrackerService],
	exports: [TrackerService],
})
export class TrackerModule {}
