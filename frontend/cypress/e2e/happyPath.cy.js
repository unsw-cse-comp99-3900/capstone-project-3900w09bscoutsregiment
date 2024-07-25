describe("Happy path", () => {
    // 1. land on homepage
    // 2. go to register page
    // 3. register a user
    // 4. go login page
    // 5. log in
    // 6. land on courses page
    // 7. go to add courses page
    // 8. add a course
    // 9. go back to courses page
    // 10. analyze the course

    it("check if we are at homepage", () => {
        cy.visit("localhost:3000/");
        cy.url().should("include", "localhost:3000");
    });

    it("successful register", () => {
        cy.visit("localhost:3000/", { failOnStatusCode: false });

        cy.get("#register-btn").click();
        cy.url().should("include", "localhost:3000/register");

        cy.get("input[name=email-address]").focus().type("alitest1@gmail.com");

        cy.get("input[name=name]").focus().type("alitest");

        cy.get("input[name=password]").focus().type("alitest123");

        cy.get("input[name=confirm-password]").focus().type("alitest123");

        cy.get("#register-submit-btn").click();
        console.log("register buttoned clicked");
        console.log(cy.url());
        cy.url().then((url) => {
            cy.log("Current URL is: " + url);
        });
        cy.url().should("include", "localhost:3000/login");
    });

    it("successful login", () => {
        cy.visit("localhost:3000/login", { failOnStatusCode: false });

        cy.get("input[name=email-address]").focus().type("alitest1@gmail.com");
        cy.get("input[name=password]").focus().type("alitest123");

        cy.get("#login-submit-btn").click();
        console.log("login button clicked");
        console.log(cy.url());
        cy.url().then((url) => {
            cy.log("Current URL is: " + url);
        });
        cy.url().should("include", "localhost:3000/courses");
    });

    it("Add a course to your courses list", () => {
        cy.visit("localhost:3000/courses", { failOnStatusCode: false });
        cy.url().should("include", "localhost:3000/courses");

        cy.get("#add-course-btn").click();
        console.log("login button clicked");

        cy.url().should("include", "localhost:3000/search");

        cy.get("input[name=course-name-input]").focus().type("COMP1511");

        cy.get("#first-course").click();

        cy.get("#navbar-courses-btn").click();
        cy.url().should("include", "localhost:3000/courses");

        cy.get("#COMP1511").should("exist");
    });

    it("Analyze a course", () => {
        cy.visit("localhost:3000/courses", { failOnStatusCode: false });
        cy.url().should("include", "localhost:3000/courses");

        cy.get("#COMP1511").should("exist");

        cy.get("#COMP1511").click();

        cy.get("#analysis-btn").should("exist");
        cy.get("#analysis-btn").click();

        cy.get("#analysis-chart").should("exist");
    });
});
