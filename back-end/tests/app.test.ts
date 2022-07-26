import { faker } from "@faker-js/faker"
import supertest from "supertest"

import app from "./../src/app.js"
import { prisma } from "./../src/database.js"
import { deleteAllData } from "./factories/scenarioFactory.js"
import { CreateRecommendationData } from "../src/services/recommendationsService.js"

beforeEach(async () => {
  await deleteAllData()
})

const agent = supertest(app)

describe("recommendations tests", () => {
  it("should create recommendation", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=E1jRjGhohpA",
    }

    const response = await agent.post("/recommendations").send(recommendation)
    expect(response.status).toBe(201)
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})
