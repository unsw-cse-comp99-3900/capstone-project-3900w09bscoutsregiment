import { slowCypressDown } from "cypress-slow-down";

slowCypressDown(400);

const performRegisterAndLogin = (testEmail) => {
    cy.visit("localhost:3000/");

    cy.get("#register-btn").click();
    cy.url().should("include", "localhost:3000/register");

    cy.get("input[name=email-address]").first().focus().type(testEmail);
    cy.get("input[name=name]").first().focus().type("alitest");
    cy.get("input[name=password]").first().focus().type("alitest123");
    cy.get("input[name=confirm-password]").first().focus().type("alitest123");

    cy.get("#register-submit-btn").click();

    cy.url().should("include", "localhost:3000/login");

    cy.get("input[name=email-address]").first().focus().type(testEmail);
    cy.get("input[name=password]").first().focus().type("alitest123");

    cy.get("#login-submit-btn").click();
    cy.url().should("include", "localhost:3000/courses");
};

const addACourse = (courseName) => {
    cy.get("#add-course-btn").click();

    cy.visit("localhost:3000/search");

    cy.url().should("include", "localhost:3000/search");

    cy.get("input[name=course-name-input]").focus().type(courseName);

    cy.get("#add-course-COMP1511").click();

    cy.get("#navbar-courses-btn").click();
    cy.url().should("include", "localhost:3000/courses");

    cy.get(`#${courseName}`).should("exist");
};

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

    it("Happy Path", () => {
        cy.visit("localhost:3000/");
        cy.url().should("include", "localhost:3000");

        const timestamp = Date.now();
        const testEmail = `alitest${timestamp}@gmail.com`;
        performRegisterAndLogin(testEmail);

        const courseName = "COMP1511";
        addACourse(courseName);

        cy.get(`#${courseName}`).should("exist");
        cy.get(`#${courseName}`).click();

        cy.get("#analysis-btn").should("exist");
        cy.get("#analysis-btn").click();

        cy.get("#analysis-chart").should("exist");
    });

    // it("User Authentication", () => {
    //     const timestamp = Date.now();
    //     const testEmail = `alitest${timestamp}@gmail.com`;
    //     performRegisterAndLogin(testEmail);
    // });

    // it("Add a course to the courses list", () => {
    //     const timestamp = Date.now();
    //     const testEmail = `alitest${timestamp}@gmail.com`;
    //     performRegisterAndLogin(testEmail);

    //     addACourse("COMP1511");
    // });

    // it("Analyze a course", () => {
    //     const timestamp = Date.now();
    //     const testEmail = `alitest${timestamp}@gmail.com`;
    //     performRegisterAndLogin(testEmail);

    //     const courseName = "COMP1511";
    //     addACourse(courseName);

    //     cy.get(`#${courseName}`).should("exist");
    //     cy.get(`#${courseName}`).click();

    //     cy.get("#analysis-btn").should("exist");
    //     cy.get("#analysis-btn").click();

    //     cy.get("#analysis-chart").should("exist");
    // });
});
