describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Tester 1',
      username: 'tester1',
      password: 'topkekret'
    }
    const user2 = {
      name: 'Tester 2',
      username: 'tester2',
      password: 'topsekret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('html').should('not.contain', 'logout')
    cy.get('html').should('not.contain', 'create new blog')
    cy.get('html').should('not.contain', 'view')
    cy.contains('login').click()
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('tester1')
      cy.get('#password').type('topkekret')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'login')
      cy.contains('create new blog')
      cy.contains('logout').click()
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('tester1')
      cy.get('#password').type('topkek')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Login failed - Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'logout')
      cy.get('html').should('not.contain', 'create new blog')
      cy.get('html').should('not.contain', 'view')
      cy.contains('login').click()
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester1', password: 'topkekret' })
    })

    it ('Blog form is shown', function() {
      cy.get('html').should('not.contain', 'login')
      cy.contains('create new blog')
      cy.contains('logout')
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Title 4 blog')
      cy.get('#author').type('Author 4 blog')
      cy.get('#url').type('www.google.fi')
      cy.contains('save').click()

      cy.contains('Title 4 blog')
      cy.contains('Author 4 blog')
      cy.contains('view').click()
      cy.contains('Tester 1')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'Likeable blog', author: 'Famous Author', url: 'www.google.fi' })
      cy.contains('view').click()
      cy.get('#likes').should('contain', '0')
      cy.contains('like').click()
      cy.get('#likes').should('contain', '1')
    })

    it('A blog can be deleted', function() {
      cy.createBlog({ title: 'Likeable blog', author: 'Famous Author', url: 'www.google.fi' })
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.on('window:confirm', () => true)
      cy.get('.notification')
        .should('contain', 'Blog Likeable blog was deleted')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'view')
    })

    it('A blog can not be deleted by other users', function() {
      cy.createBlog({ title: 'Likeable blog', author: 'Famous Author', url: 'www.google.fi' })
      cy.contains('logout').click()
      cy.login({ username: 'tester2', password: 'topsekret' })
      cy.contains('view').click()
      cy.get('html').should('not.contain', 'delete')
    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'Nice blog', author: 'Famous Author', url: 'www.google.fi' })
        cy.createBlog({ title: 'Bad blog', author: 'Author Who', url: 'www.google.fi' })
        cy.createBlog({ title: 'Decent blog', author: 'Some Author', url: 'www.google.fi' })
      })

      it('then blogs are organized by likes', function () {
        cy.contains('Nice blog')
          .contains('view').click()
        cy.contains('like').click().click()
        cy.contains('Nice blog')
          .contains('hide').click()

        cy.contains('Decent blog')
          .contains('view').click()
        cy.contains('like').click()

        cy.contains('Bad blog')
          .contains('view').click()

        cy.contains('Nice blog')
          .contains('view').click()

        cy.get('.blogs').first().find('#likes').should('contain', '2')
        cy.get('.blogs').last().find('#likes').should('contain', '0')
      })
    })

  })

})