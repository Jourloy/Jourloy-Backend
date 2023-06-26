import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import helmet from "helmet";
import pkg from "../package.json";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import {ValidationPipe} from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`dotenv`).config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Some thins

	app.use(cookieParser());

	// Swagger

	const config = new DocumentBuilder()
		.setTitle(`Tracker`)
		.setDescription(`Tracker app of Twyxify ecosystem`)
		.setExternalDoc(`Github`, `https://github.com/Twyxify/Tracker-Backend`)
		.setVersion(pkg.version)
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup(`api`, app, document);

	// Defence

	app.enableCors({
		origin: [`https://${process.env.DOMAIN}`, `https://dev.${process.env.DOMAIN}`],
		credentials: true,
	});
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe());

	// Sessions

	app.use(
		session({
			store: MongoStore.create({
				mongoUrl: `mongodb://${process.env.MONGO_HOST}/sessions`,
				ttl: 1000 * 60,
				autoRemove: `native`,
			}),
			secret: process.env.SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60,
				domain: process.env.DOMAIN,
			},
		})
	);

	await app.listen(6000, `0.0.0.0`);
}

bootstrap().then();
