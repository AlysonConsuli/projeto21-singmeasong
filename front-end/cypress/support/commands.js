Cypress.Commands.add("resetRecommendations", () => {
  cy.log("resetando recommendations")
  cy.request("POST", "http://localhost:5000/recommendations/reset")
})
