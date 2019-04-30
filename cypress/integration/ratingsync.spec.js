describe('ratings fail and reset', function() {
  beforeEach(function() {
    cy.login();
  });

  it('delayed response brings state out of sync', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/recipes',
      status: 200,
      response: 'fixture:recipes.json'
    });
    cy.route({
      method: 'GET',
      url: '/api/recipes/rated/?id=1&id=2&id=3',
      status: 200,
      response: [
        { id: 1, rating: 0 },
        { id: 2, rating: 2 },
        { id: 3, rating: 1 }
      ]
    });
    cy.route({
      delay: 200,
      method: 'PUT',
      url: '/api/recipes/rate/1/4',
      status: 500,
      response: ''
    });
    cy.route({
      method: 'PUT',
      url: '/api/recipes/rate/1/3',
      status: 200,
      response: { id: 1, rating: 3 }
    });
    cy.visit('/');
    cy.get('[data-cy=rate_4]')
      .first()
      .click();
    cy.get('[data-cy=rate_3]')
      .first()
      .click();
    cy.get('[data-cy=input_3]')
      .first()
      .should('be.checked');
  });
});
