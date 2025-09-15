import { PrismaClient } from "../generated/prisma"

declare global{
    var prisma: PrismaClient | undefined
}

const prismaInstance = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = prismaInstance
}

export const prisma = prismaInstance

export * from "../generated/prisma"