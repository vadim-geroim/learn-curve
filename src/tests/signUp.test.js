const bcrypt = require('bcryptjs');
const {createToken} = require('../auth/jwt');
const resolvers = require('../resolvers/resolvers');

//Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        }
    };
    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
    };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('User Sign-Up Mutation', () => {
    const mockUserData = {
        name: 'John Doe',
        email: 'jhon@example.com',
        password: 'password123'
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully sign up a new user and return a token', async () => {
        //Mock that no user exists already
        prisma.user.findUnique.mockResolvedValue(null);

        //Mock the creation of a user in the database
        prisma.user.create.mockResolvedValue({
            id: 1,
            ...mockUserData,
            password: await bcrypt.hash(mockUserData.password, 10),
        });

        const result = await resolvers.Mutation.singUp(null, mockUserData);

        expect(result).toHaveProperty('token');
        expect(typeof result.token).toBe('string');
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: mockUserData.name,
                email: mockUserData.email,
                password: expect.any(String), //hashed password
            }
        })
    });

    it('should throw an error if the user already exists', async () => {
        //Mock that a user with the same email already exists
        prisma.user.findUnique.mockResolvedValue(mockUserData);

        await expect(
            resolvers.Mutation.singUp(null, mockUserData)
        ).rejects.toThrow("User already exists");
        
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {email: mockUserData.email},
        })
    });
});