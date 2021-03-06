import express, { Request, Response } from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import('express-session');
import passportGitHub, { OAuth2StrategyOptionsWithoutRequiredURLs } from 'passport-github';

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
    refreshToken: string;
  }
}

const router = express.Router();

// Initialize passport

router.use(passport.initialize());
router.use(passport.session());

// Configure the GitHub strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the GitHub API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new passportGitHub.Strategy(
    {
      clientID: global.cfg.server.gitHubClientId,
      clientSecret: global.cfg.server.gitHubClientSecret,
      callbackURL: `${global.cfg.common.apiUrl}auth/callback`,
      passReqToCallback: true,

    },
    function (req: Request,
              accessToken: string,
              refreshToken: string,
              profile: passportGitHub.Profile,
              cb: OAuth2Strategy.VerifyCallback) {
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;

      cb(null, profile);
    },
  ),
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Configure authentication routes

router.get('/',
  passport.authenticate('github', { scope: [ 'public_repo' ] }),
);

router.get('/callback',
  passport.authenticate('github',
  {
    failureRedirect: global.cfg.common.webUrl,
    successRedirect: global.cfg.common.webUrl,
    session: true,
  })
);

router.get('/user',
  (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        user: req.user,
        token: req.session.accessToken,
      });

      return;
    }

    res.sendStatus(401);
  },
);

router.get('/logout',
  (req, res) => {
    req.logOut();
    res.redirect(global.cfg.common.webUrl);
  },
);

export default router;
