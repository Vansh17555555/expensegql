import Transaction from '../models/transaction_model.js';

const transactionResolver = {
    Query: {
        transactions: async(_, __, context) => {
            if (!context.getUser()) throw new Error("unauthorised");
            const userId = context.getUser()._id;
            const transactions = await Transaction.find({ userId: userId });
            return transactions;
        },
        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        categoryStatistics: async(_, __, context) => {
            if (!context.getUser()) throw new Error("Unauthorized");
            const userId = context.getUser()._id;
            const transactions = await Transaction.find({ userId });
            const categoryMap = {};

            transactions.forEach((transaction) => {
                if (!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;
            });

            return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const userId = context.getUser()._id;
                const newTransaction = new Transaction({ ...input, userId });
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        updateTransaction: async (_, { input }) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true });
                return updatedTransaction;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    }
};

export default transactionResolver;
