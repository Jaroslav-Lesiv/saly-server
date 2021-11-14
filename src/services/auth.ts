import passport = require('passport');
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { APPLICATION_ERRORS } from '../modules/applications/applications.errors';
import ApplicationModel from '../modules/applications/applications.model';
import { SERVICE_ERRORS } from '../modules/services/service.errors';
import ServiceModel from '../modules/services/service.model';

class Authentification {
  private jwtApplicationStrategy = new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: any, done: any) => {
      try {
        const application = await ApplicationModel.findById(payload.application);
        if (!application) {
          done({ message: APPLICATION_ERRORS.NOT_FOUND }, false);
          return;
        } else if (!application.active) {
          done({ message: APPLICATION_ERRORS.APPLICATION_NOT_ACTIVE }, false);
          return;
        }
        done(null, application);
      } catch (error) {
        done(error, false);
      }
    },
  );

  private jwtServiceStrategy = new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: any, done: any) => {
      try {
        console.log({ payload });
        let user = await ServiceModel.findById(payload.id);

        if (!user) {
          done({ message: SERVICE_ERRORS.NOT_FOUND }, false);
          return;
        } else if (!user.active) {
          done({ message: SERVICE_ERRORS.NOT_ACTIVE }, false);
          return;
        } else if (user.deleted) {
          done({ message: SERVICE_ERRORS.DELETED }, false);
          return;
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  );

  constructor() {
    this.initPasswortStrategies();
  }

  private initPasswortStrategies() {
    passport.use('jwt_application', this.jwtApplicationStrategy);
    passport.use('jwt_service', this.jwtServiceStrategy);
  }

  public authByJWTApplication = passport.authenticate('jwt_application', { session: false });
  public authByJWTService = passport.authenticate('jwt_service', { session: false });
}

const authentication = new Authentification();

export default authentication;
