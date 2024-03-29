import passport from 'passport';
import { Strategy as JwtStrategy ,ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from 'passport-github2'
import userModel from '../model/userSchema';


const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY || 'jwtauth1010'
};


passport.use(
    new JwtStrategy(opts, async (payload, done) => {
        try {

            if(payload.userId) {
                const user = payload.userId;
                return done(null, user);
            }else{
                return done(null,false);
            }
        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    })
);

// passport.use(
//     new JwtStrategy(
//         {
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: process.env.JWT_KEY || 'secret-key'
//         }, 
//         function async (payload, done) {
//         console.log('passport')
//         console.log(payload)
//         try {
//             if (payload.userId) {
//                 const user = payload.userId;
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: 'Invalid token or user not found' });
//             }
//         } catch (err) {
//             return done(err, false);
//         }
//     })
// );

passport.use(
    new GoogleStrategy(
        {
            clientID:'719673239522-kfgafnqgvkv3qtje3v0f342vj6ivc5c0.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'/callback/google',
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

// passport.use(
//     new GitHubStrategy(
//         {
//             clientID: 'e883579b2d4f78dd3645',
//             clientSecret: 'e21f99ab10380252867a9808c74205811c1225d3',
//             callbackURL: "/github/callback"
//         },
//         async (accessToken, refreshToken, profile, done) => {

//         }
//     )
// );

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user:any, done) => {
    done(null, user);
});


export default passport;
