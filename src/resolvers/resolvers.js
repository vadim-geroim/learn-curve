const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { createToken } = require("../auth/jwt");

const prisma = new PrismaClient();

const resolvers = {
  Query: {},
  Mutation: {
    async singUp(_, { name, email, password }) {
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return { token: createToken(user) };
    },
    async login(_, { email, password }) {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("User not found");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Invalid password");
      }

      return { token: createToken(user) };
    },
  },
};

module.exports = resolvers;
