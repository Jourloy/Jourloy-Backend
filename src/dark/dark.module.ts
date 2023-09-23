import {Module} from "@nestjs/common";
import {DarkService} from "./dark.service";
import {DarkController} from "./dark.controller";
import {PrismaModule} from "src/database/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [DarkController],
	providers: [DarkService],
})
export class DarkModule {}
