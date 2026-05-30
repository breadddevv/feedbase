import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Account, Comment, Session, Suggestion, SuggestionCategory, SuggestionStatus, User, Verification, Vote } from "../generated/prisma/client";
import { Pool } from "pg";

export const dbpool = new Pool({ // better-auth stuff
    connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter })

export type { Account, Comment, Session, Suggestion, SuggestionCategory, SuggestionStatus, User, Verification, Vote }