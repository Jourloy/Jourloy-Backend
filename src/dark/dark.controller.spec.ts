import {Test, TestingModule} from "@nestjs/testing";
import {DarkController} from "./dark.controller";
import {DarkService} from "./dark.service";

describe("DarkController", () => {
	let controller: DarkController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DarkController],
			providers: [DarkService],
		}).compile();

		controller = module.get<DarkController>(DarkController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
