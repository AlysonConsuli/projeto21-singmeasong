import { faker } from "@faker-js/faker"
import supertest from "supertest"

import app from "./../src/app.js"
import { prisma } from "./../src/database.js"
import { deleteAllData } from "./factories/scenarioFactory.js"

beforeEach(async () => {
  await deleteAllData()
})

const agent = supertest(app)

describe("recommendations tests", () => {
  it("should create recommendation", async () => {})
})

afterAll(async () => {
  await prisma.$disconnect()
})
