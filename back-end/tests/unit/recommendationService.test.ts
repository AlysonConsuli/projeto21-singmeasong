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
    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce(null)
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

  it("should downvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation)
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: score - 1,
    })
    await recommendationService.downvote(id)
    expect(recommendationRepository.updateScore).toBeCalled()
  })

  it("should remove recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation)
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: score - 6,
    })
    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce(null)
    await recommendationService.downvote(id)
    expect(recommendationRepository.remove).toBeCalled()
  })

  it("should get all recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([recommendation])
    const recommendations = await recommendationService.get()
    expect(recommendations).toEqual([recommendation])
  })

  it("should get recommendations by score", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce([recommendation])
    const recommendations = await recommendationService.getTop(1)
    expect(recommendations).toEqual([recommendation])
  })

  it("should get random recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([recommendation])
    const randomRecommendation = await recommendationService.getRandom()
    expect(randomRecommendation).toEqual(recommendation)
  })

  it("should return not found error if doesnt has recommendation", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([])
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([])
    const promise = recommendationService.getRandom()
    expect(promise).rejects.toEqual({
      type: "not_found",
      message: "",
    })
  })

  it("should delete all recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "deleteAll")
      .mockResolvedValueOnce(null)
    await recommendationService.deleteAll()
    expect(recommendationRepository.deleteAll).toBeCalled()
  })

  it("getScoreFilter should return gt or lte", () => {
    let scoreFilter = recommendationService.getScoreFilter(0.8)
    expect(scoreFilter).toBe("lte")
    scoreFilter = recommendationService.getScoreFilter(0.6)
    expect(scoreFilter).toBe("gt")
  })
})
