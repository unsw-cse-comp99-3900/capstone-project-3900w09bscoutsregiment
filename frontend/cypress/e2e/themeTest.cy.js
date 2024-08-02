import { slowCypressDown } from "cypress-slow-down";

slowCypressDown(400);

/**
 * Perform a login with a registered test email.
 */
const performLogin = () => {
    cy.visit("localhost:3000/");

    cy.get("#login-btn").click();
    cy.url().should("include", "localhost:3000/login");

    cy.get("input[name=email-address]").first().focus().type("donnkey3@gmail.com");
    cy.get("input[name=password]").first().focus().type("1111111");

    cy.get("#login-submit-btn").click();
    cy.url().should("include", "localhost:3000/courses");
};

/**
 *  
 * // 1. login
    // 2. go to profiles page
    // 3. locate the theme button
    // 4. go theme button
    // 5. go to theme change page
    // 6. Change the theme to dark
    // 7. Change the themne to light
    // 8. Chagne the theme to color blind
    // 9. Change the theme to light
 */
describe("Theme Test", () => {
    beforeEach(() => {
        performLogin();
    });
    /**
     * Things to test:
     * 1. Name of email
     * 2. logout button exist
     * 3. change email button exist
     * 4. change password button exist
     * 5. feedback button exist
     * 6. theme button exist
     * 
     */
    it("Profiles page loads and buttons exist", () => {

        cy.visit("localhost:3000/profile");
        cy.url().should("include", "profile");

        // Check for email
        cy.get('input[type="text"][value="donnkey3@gmail.com"]').should("exist");

        // Check buttons
        cy.get('a[href="/"]').should("exist"); // Logout button
        cy.get('a[href="/changeEmail"]').should("exist"); // Change email button
        cy.get('a[href="/resetPassword"]').should("exist"); // Change password button
        cy.get('a[href="/feedback"]').should("exist"); // Feedback button
        cy.get('a[href="/profile/themeToggle"]').should("exist"); // Theme button
    });

    it("Change theme from light to dark and back", () => {
        cy.visit("http://localhost:3000/profile/themeToggle");

        // Change to dark theme
        cy.get('#dark-theme-btn').click();
        cy.get("html").should("have.class", "dark");

        // Change back to light theme
        cy.get('#light-theme-btn').click();
        cy.get("html").should("have.class", "light");

        // Change to color blind theme
        cy.get('#color-blind-theme-btn').click();
        cy.get("html").should("have.class", "color-blind");

        // Change back to light theme
        cy.get('#light-theme-btn').click();
        cy.get("html").should("have.class", "light");

        // Navigate back to profile
        cy.get('a[href="/profile"]').click();
        cy.url().should("include", "profile");

    });
  
});
