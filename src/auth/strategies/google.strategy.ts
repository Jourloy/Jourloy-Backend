import {PassportStrategy} from "@nestjs/passport";
import {Strategy, VerifyCallback} from "passport-google-oauth20";
import {Injectable} from "@nestjs/common";
import {IGoogleAuthProfile} from "../../../types";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, `google`) {
	constructor() {
		const uri =
			process.env.DEPLOYMENT_MODE === `local`
				? `http://localhost:${process.env.PORT}`
				: `https://jourloy.${process.env.DOMAIN_NAME}`;

		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${uri}/auth/google/callback`,
			scope: [`profile`, `email`],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: IGoogleAuthProfile,
		done: VerifyCallback
	) {
		/*
		 * Add your validation logic here
		 * The 'profile' object will contain user details from Google
		 */
		const {id, displayName, emails, photos} = profile;
		const user = {
			googleId: id,
			displayName,
			email: emails[0],
			photos,
		};

		done(null, user);
	}
}
