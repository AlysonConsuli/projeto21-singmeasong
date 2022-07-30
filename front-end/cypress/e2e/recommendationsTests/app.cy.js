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

  it("should downvote by 1", () => {
    cy.createRecommendation(recommendation)
    cy.getRecommendation().then((res) => {
      cy.visit(`${URL}/`)

      cy.intercept("POST", `/recommendations/${res.id}/downvote`).as("downvote")
      cy.get("article").find("div:last-child").find("svg:last-child").click()
      cy.wait("@downvote").its("response.statusCode").should("eq", 200)

      cy.getRecommendation().then((res2) => {
        expect(res2.score).equal(res.score - 1)
      })
    })
  })

  it("should remove recommendation", () => {
    cy.createRecommendation(recommendation)
    cy.getRecommendation().then((res) => {
      cy.visit(`${URL}/`)
      cy.intercept("POST", `/recommendations/${res.id}/downvote`).as("downvote")
      for (let i = 0; i < 5; i++) {
        cy.get("article").find("div:last-child").find("svg:last-child").click()
      }
      cy.wait("@downvote").its("response.statusCode").should("eq", 200)

      cy.intercept("POST", `/recommendations/${res.id}/downvote`).as("remove")
      cy.get("article").find("div:last-child").find("svg:last-child").click()
      cy.wait("@remove").its("response.statusCode").should("eq", 200)

      cy.get("div").should(
        "contain",
        "No recommendations yet! Create your own :)",
      )
    })
  })
})

describe("get recommendations tests", () => {
  it("should return the last 10 recommendations", () => {
    const recommendationsQty = +faker.random.numeric(1) + 10
    const lastRecommendationName = `${recommendation.name} ${
      recommendationsQty - 1
    }`
    cy.createManyRecommendations(recommendationsQty, recommendation)

    cy.visit(`${URL}/`)
    cy.get("article").should("have.length", 10)
    cy.get("article")
      .find("div:first-child")
      .should("contain", lastRecommendationName)
  })

  it("should get random recommendation", () => {
    const recommendationsQty = +faker.random.numeric(1, { bannedDigits: ["0"] })
    cy.createManyRecommendations(recommendationsQty, recommendation)

    cy.visit(`${URL}/random`)
    cy.get("article").should("have.length", 1)
    cy.get("article")
      .find("div:first-child")
      .should("contain", recommendation.name)
  })

  it("should get recommendations order by score", () => {
    const recommendationsQty = +faker.random.numeric(1, {
      bannedDigits: ["0", "1"],
    })
    cy.createManyRecommendations(recommendationsQty, recommendation)

    cy.visit(`${URL}/top`)
    cy.intercept("POST", `/recommendations/**`).as("upvote")
    cy.get("article:last-child")
      .find("div:last-child")
      .find("svg:first-child")
      .click()
    cy.wait("@upvote").its("response.statusCode").should("eq", 200)

    cy.get("article:nth-child(3)").find("div:last-child").should("contain", "1")
  })
})
