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
  const recommendationSave = await prisma.recommendation.create({
    data: recommendation,
  })
  return recommendationSave
}

export async function getRecommendationByName(name: string) {
  const recommendation = await prisma.recommendation.findFirst({
    where: { name },
  })
  return recommendation
}
