/// <reference types="cypress" />

import { faker } from "@faker-js/faker"

const URL = "http://localhost:3000"

describe("app test", () => {
  const recommendation = {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=E1jRjGhohpA",
  }

  beforeEach(() => {
    cy.resetRecommendations()
  })

  it("should create a recommendation", () => {
    cy.visit(`${URL}/`)
    cy.get("#name").type(recommendation.name)
    cy.get("#youtubeLink").type(recommendation.youtubeLink)

    cy.intercept("POST", "/recommendations").as("postRecommendation")
    cy.get("#createRecommendation").click()
    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 201)
  })
})
