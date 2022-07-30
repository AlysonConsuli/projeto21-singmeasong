/// <reference types="cypress" />

import { faker } from "@faker-js/faker"

const URL = "http://localhost:3000"
const recommendation = {
  name: faker.music.songName(),
  youtubeLink: "https://www.youtube.com/watch?v=E1jRjGhohpA",
}

beforeEach(() => {
  cy.resetRecommendations()
})

describe("post recommendations tests", () => {
  it("should create a recommendation", () => {
    cy.visit(`${URL}/`)
    cy.get("#name").type(recommendation.name)
    cy.get("#youtubeLink").type(recommendation.youtubeLink)

    cy.intercept("POST", "/recommendations").as("postRecommendation")
    cy.get("#createRecommendation").click()
    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 201)
  })

  it("given a recommendation with same name that other, receive 409", () => {
    cy.createRecommendation(recommendation)
    cy.visit(`${URL}/`)
    cy.get("#name").type(recommendation.name)
    cy.get("#youtubeLink").type(recommendation.youtubeLink)

    cy.intercept("POST", "/recommendations").as("postRecommendation")
    cy.get("#createRecommendation").click()
    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 409)
  })

  it("given a link that is not from youtube, receive 422", () => {
    cy.visit(`${URL}/`)
    cy.get("#name").type(recommendation.name)
    cy.get("#youtubeLink").type("https://www.google.com/")

    cy.intercept("POST", "/recommendations").as("postRecommendation")
    cy.get("#createRecommendation").click()
    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 422)
  })
})

describe("post recommendations upvote/downvote tests", () => {
  it("should upvote by 1", () => {
    cy.createRecommendation(recommendation)
    cy.getRecommendation().then((res) => {
      cy.visit(`${URL}/`)

      cy.intercept("POST", `/recommendations/${res.id}/upvote`).as("upvote")
      cy.get("article").find("div:last-child").find("svg:first-child").click()
      cy.wait("@upvote").its("response.statusCode").should("eq", 200)

      cy.getRecommendation().then((res2) => {
        expect(res2.score).equal(res.score + 1)
      })
    })
  })
})
