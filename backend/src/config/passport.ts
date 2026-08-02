import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../modules/user/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), undefined);
        }

        const existingUser = await User.findOne({
          $or: [{ providerId: profile.id }, { email }],
        });

        if (existingUser) {
          if (!existingUser.providerId) {
            existingUser.provider = "google";
            existingUser.providerId = profile.id;
            await existingUser.save();
          }

          return done(null, existingUser);
        }

        const newUser = await User.create({
          fullName: profile.displayName,
          email,
          provider: "google",
          providerId: profile.id,
          isVerified: true,
          ...(profile.photos?.[0]?.value && {
            avatar: profile.photos[0].value,
          }),
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

export default passport;