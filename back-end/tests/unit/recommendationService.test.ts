import { jest } from "@jest/globals"

import { recommendationService } from "../../src/services/recommendationsService.js"
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import { recommendationBody } from "../factories/recommendationFactory.js"

describe("recommendationService test suite", () => {
  const recommendation = recommendationBody()

  it("should create recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null)
    jest
      .spyOn(recommendationRepository, "create")
      .mockResolvedValueOnce(recommendation as any)
    await recommendationService.insert(recommendation)
    expect(recommendationRepository.create).toBeCalled()
  })
})
