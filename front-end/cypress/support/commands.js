Cypress.Commands.add("resetRecommendations", () => {
  cy.log("reset recommendations")
  cy.request("POST", "http://localhost:5000/recommendations/reset")
})

Cypress.Commands.add("createRecommendation", (recommendation) => {
  cy.request(
    "POST",
    "http://localhost:5000/recommendations",
    recommendation,
  ).then((res) => {
    cy.log(res)
  })
})

Cypress.Commands.add("getRecommendation", () => {
  cy.request("GET", "http://localhost:5000/recommendations").then((res) => {
    return res.body[0]
  })
})
