describe('My First Test', function() {
  beforeEach(function() {
    cy.login();
  });
  it('our app runs', function() {
    cy.visit('/recipe/add');
    cy.get('button').should('be.disabled');
  });

  it('filter works', function() {
    cy.visit('/');
    cy.get('[data-cy=filterInput]').type('sp');
    cy.get('[data-cy=recipeCard]').should('have.length', 1);
  });

  it('mock recipe get', function() {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/recipes',
      status: 200,
      response: 'fixture:recipes.json'
    });

    cy.visit('/');
    cy.get('[data-cy=recipeCard]').should('have.length', 3);
    cy.get('[data-cy=appError]').should('not.be.visible');
  });

  it('on error should show error message', function() {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/recipes',
      status: 500,
      response: 'ERROR'
    });
    cy.visit('/');
    cy.get('[data-cy=appError]').should('be.visible');
  });
});
