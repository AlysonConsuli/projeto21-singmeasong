Cypress.Commands.add("resetRecommendations", () => {
  cy.log("reset recommendations")
  cy.request("POST", "http://localhost:5000/recommendations/reset")
})
