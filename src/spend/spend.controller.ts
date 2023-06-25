import {Controller} from "@nestjs/common";
import {SpendService} from "./spend.service";

@Controller(`spend`)
export class SpendController {
	constructor(private readonly spendService: SpendService) {}
}
