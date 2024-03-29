import passport from 'passport';
import { Strategy as JwtStrategy ,ExtractJwt, StrategyOptions } from 'passport-jwt';


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
            } else {
                return done(null,false);
            }
        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    })
);



passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user:any, done) => {
    done(null, user);
});


export default passport;
