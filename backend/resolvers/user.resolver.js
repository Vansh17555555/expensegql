import Transaction from "../models/transaction_model.js";
import User from "../models/user_model.js";
import bcrypt from "bcryptjs";

const userResolver = {
    Query: {
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (err) {
                console.error("Error in authUser:", err);
                throw new Error(err.message);
            }
        },
        user: (_, { userId }) => {
            return User.findById(userId);
        }
    },
    Mutation: {
        Login: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                console.log("Login input:", input);

                const { user } = await context.authenticate("graphql-local", { username, password });
                console.log("Authenticated user:", user);

                await context.login(user);
                return user;
            } catch (err) {
                console.error("Error in login:", err);
                throw new Error(err.message);
            }
        },
        logout: async (_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy((err) => {
                    if (err) throw err;
                });
                context.res.clearCookie("connect.sid");
                return { message: "Logged out successfully" };
            } catch (err) {
                console.error("Error in logout:", err);
                throw new Error(err.message);
            }
        },
        signup: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input;
                if (!username || !name || !password || !gender) {
                    throw new Error("All fields are required");
                }
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error("User already exists");
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const profilePic = gender === "male" ?
                    `https://avatar-placeholder.iran.liara.run/public/boy?username/${username}` :
                    `https://avatar-placeholder.iran.liara.run/public/girl?username/${username}`;
                const newUser = new User({
                    name,
                    username,
                    password: hashedPassword,
                    gender,
                    profilePicture: profilePic
                });
                console.log("Creating new user:", newUser);
                await newUser.save();
                await context.login(newUser);
                return newUser;
            } catch (err) {
                console.error("Error in signup:", err);
                throw new Error(err.message);
            }
        }
    },
    User:{
        transactions:async(parent)=>{
            try {
                const transactions=await Transaction.find({user:parent._id})
                return transactions
            }
            catch(error){
                throw new Error(error.message)
            }
        }  
    }
};

export default userResolver;
