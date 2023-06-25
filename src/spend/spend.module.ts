import {Module} from "@nestjs/common";
import {SpendService} from "./spend.service";
import {SpendController} from "./spend.controller";

@Module({
	controllers: [SpendController],
	providers: [SpendService],
})
export class SpendModule {}
