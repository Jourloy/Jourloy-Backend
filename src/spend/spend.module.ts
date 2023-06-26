import {Module} from "@nestjs/common";
import {SpendService} from "./spend.service";
import {SpendController} from "./spend.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Spend, SpendSchema } from "./schemas/spend.schema";
import { UserModule } from "src/user/user.module";
import { TrackerModule } from "src/tracker/tracker.module";

@Module({
	imports: [
		MongooseModule.forFeature([{name: Spend.name, schema: SpendSchema}]),
		TrackerModule,
		UserModule,
	],
	controllers: [SpendController],
	providers: [SpendService],
})
export class SpendModule {}
