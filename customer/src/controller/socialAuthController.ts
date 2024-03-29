import passport from 'passport';
import { Strategy as JwtStrategy ,ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from '../model/userSchema'




const GOOGLE_CLIENT_SECRET = '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'
const GOOGLE_CLIENT_ID = '719673239522-kfgafnqgvkv3qtje3v0f342vj6ivc5c0.apps.googleusercontent.com'


passport.use(
    new GoogleStrategy(
        {
            clientID:'719673239522-kfgafnqgvkv3qtje3v0f342vj6ivc5c0.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'/auth/callback/google',
        },
        async (accessToken, refreshToken, profile, done) => {
            const { name,email } = profile._json;

            let user = await userModel.findOne({ email: email });
            if(user == null) {
                const newUser = new userModel({
                    email:email,
                    name:name
                });
                const validationError = newUser.validateSync();

                if( validationError ) {
                    throw new Error(validationError.message);
                }

                user = await newUser.save();
            }
            done(null, user);
        }
    )
);