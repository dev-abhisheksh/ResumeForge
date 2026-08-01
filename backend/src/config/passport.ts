import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import User from "../modules/user/user.model.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
},
async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({
        $or: [
            {providerId: profile.id},
            {email: profile.emails?.[0]?.value}
        ]
    })

    if(existingUser){
        if(!existingUser.providerId){
            existingUser.provider = "google";
            existingUser.providerId = profile.id;
            await existingUser.save();
        }

        return done(null, existingUser)
    }
}));