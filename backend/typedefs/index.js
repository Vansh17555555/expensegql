import { mergeTypeDefs } from "@graphql-tools/merge";

// typeDefs
import userTypeDef from "./user.typedef.js";
import transactionTypeDef from "./transaction.typedef.js";

const typeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default typeDefs;
