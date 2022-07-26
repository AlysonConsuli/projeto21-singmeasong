import { faker } from "@faker-js/faker"

import { prisma } from "../../src/database.js"
import { CreateRecommendationData } from "../../src/services/recommendationsService.js"

export function recommendationBody() {
  const recommendation = {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=E1jRjGhohpA",
  }
  return recommendation
}

export async function createRecommendation(
  recommendation: CreateRecommendationData,
) {
  await prisma.recommendation.create({
    data: recommendation,
  })
}
