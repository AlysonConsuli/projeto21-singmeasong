const BACKEND_URL = "http://localhost:5000"

Cypress.Commands.add("resetRecommendations", () => {
  cy.log("reset recommendations")
  cy.request("POST", `${BACKEND_URL}/recommendations/reset`)
})

Cypress.Commands.add("createRecommendation", (recommendation) => {
  cy.request("POST", `${BACKEND_URL}/recommendations`, recommendation)
})

Cypress.Commands.add("createManyRecommendations", (qty, recommendation) => {
  for (let i = 0; i < qty; i++) {
    cy.request("POST", `${BACKEND_URL}/recommendations`, {
      ...recommendation,
      name: `${recommendation.name} ${i}`,
    })
  }
})

Cypress.Commands.add("getRecommendation", () => {
  cy.request("GET", `${BACKEND_URL}/recommendations`).then((res) => {
    return res.body[0]
  })
})
