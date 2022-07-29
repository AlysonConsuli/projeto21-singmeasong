import { jest } from "@jest/globals"

import { recommendationService } from "../../src/services/recommendationsService.js"
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import { recommendationBody } from "../factories/recommendationFactory.js"

describe("recommendationService test suite", () => {
  const recommendation = { ...recommendationBody(), id: 1, score: 0 }
  const { id, name, youtubeLink, score } = recommendation

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

  it("given a recommendation name equals to another, return conflict error", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(recommendation)
    const promise = recommendationService.insert(recommendation)
    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    })
  })

  it("given a recommendation id that doesnt exist, return not found error", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null)
    const promise = recommendationService.getById(id)
    expect(promise).rejects.toEqual({
      type: "not_found",
      message: "",
    })
  })

  it("should upvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation)
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: score + 1,
    })
    await recommendationService.upvote(id)
    expect(recommendationRepository.updateScore).toBeCalled()
  })
})
