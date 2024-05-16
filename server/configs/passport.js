import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as dotenv from "dotenv";
import UserModal from "../modals/userModal.js";
dotenv.config();

const passportConfig = () => {
  // console.log(process.env.JWT_SECRET);
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };
  const myStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserModal.findById(jwt_payload.sub);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(myStrategy);
};

export { passportConfig };
