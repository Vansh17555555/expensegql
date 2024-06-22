import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user_model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                console.log("Authenticating user:", username); // Log username
                const user = await User.findOne({ username });
                console.log("Retrieved user:", user); // Log retrieved user

                if (!user) {
                    console.log("User not found");
                    throw new Error("Invalid username or password");
                }

                const validPassword = await bcrypt.compare(password, user.password);
                console.log("Password match:", validPassword); // Log password match result

                if (!validPassword) {
                    console.log("Password does not match");
                    throw new Error("Invalid username or password");
                }

                return done(null, user);
            } catch (err) {
                console.error("Error in authentication:", err); // Log detailed error
                return done(err);
            }
        })
    );
};
