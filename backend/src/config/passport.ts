import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db";
import { randomUUID } from "crypto";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done
    ) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"));
        }

        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        // 1️⃣ Check existing user
        const { rows } = await db.query(
          "SELECT * FROM users WHERE google_id = $1",
          [googleId]
        );

        let user;

        if (rows.length === 0) {
          user = {
            id: randomUUID(),
            google_id: googleId,
            name,
            email,
            avatar_url: avatar,
          };

          await db.query(
            `
            INSERT INTO users (id, google_id, name, email, avatar_url)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
              user.id,
              user.google_id,
              user.name,
              user.email,
              user.avatar_url,
            ]
          );
        } else {
          user = rows[0];
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
