const FRONTEND_URI = "http://localhost:5174"
const BACKEND_URI = "http://localhost:3002"
describe("Note app", () => {
  beforeEach(() => {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`)
    const user = {
      name: "oswald",
      username: "coala",
      password: "bear",
    }
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user)
    cy.visit("")
  })

  it("front page can be opened", () => {
    cy.contains("Notes")
    cy.contains("Note app, Department of Computer Science, University of Helsinki 2023")
  })

  it("can open login form", () => {
    cy.contains("login").click()
  })

  it("user can log in", () => {
    cy.contains("login").click()
    cy.get("input#username").type("coala")
    cy.get("input#password").type("bear")
    cy.get("button#login").click()
    cy.contains("oswald logged in")
  })

  it("login fails with wrong password", () => {
    cy.contains("login").click()
    cy.get("input#username").type("coala")
    cy.get("input#password").type("wrong password")
    cy.get("button#login").click()
    cy.get(".error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid")

    cy.get("html").should("not.contain", "oswald logged in")
  })

  describe("when logged in", () => {
    beforeEach(() => {
      const user = {
        name: "oswald",
        username: "coala",
        password: "bear",
      }

      cy.login(user)
    })

    it("a new note can be created", () => {
      cy.contains("new note").click()
      cy.get("input#note").type("a note created by cypress")
      cy.get("button#save").click()
      cy.contains("a note created by cypress")
    })

    describe("and a note exists", () => {
      describe("and several notes exist", () => {
        beforeEach(() => {
          cy.createNote({ content: "first note", important: false, })
          cy.createNote({ content: "second note", important: false, })
          cy.createNote({ content: "third note", important: false, })
        })


        it("one of those can be made important", () => {
          cy.contains("second note")
            .parent()
            .find("button")
            .as("theButton")

          cy.get("@theButton").click()
          cy.get("@theButton").should("contain", "make not important")
        })

        it("then example", () => {
          cy.get("button").then(buttons => {
            console.log("number of buttons", buttons.length)
            debugger
            cy.wrap(buttons[0]).click()
          })
        })
      })
    })
  })
})
