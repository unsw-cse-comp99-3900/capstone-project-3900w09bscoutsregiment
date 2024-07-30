import React from 'react'
import CourseReasoning from './page'

describe('<CourseReasoning />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CourseReasoning />)
  })
})