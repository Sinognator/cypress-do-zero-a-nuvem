describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach("Verifica o título da aplicação", () =>{
    cy.visit('../../src/index.html').viewport(410, 860)
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').should('be.visible').type(Cypress.env('firstName'))
    cy.get('#lastName').should('be.visible').type(Cypress.env('lastName'))
    cy.get('#email').should('be.visible').type(Cypress.env('email'))
    cy.get('#open-text-area').should('be.visible').type(Cypress.env('text-area'))
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible').tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').should('be.visible').type(Cypress.env('firstName'))
    cy.get('#lastName').should('be.visible').type(Cypress.env('lastName'))
    cy.get('#email').should('be.visible').type("asdf")
    cy.get('#open-text-area').should('be.visible').type(Cypress.env('text-area'))

    cy.validateErrorMessage()
  })

  it('validar o não preenchimento do campo telefone com caracteres diferentes de numerico', () => {
    cy.get('#firstName').should('be.visible').type(Cypress.env('firstName'))
    cy.get('#lastName').should('be.visible').type(Cypress.env('lastName'))
    cy.get('#email').should('be.visible').type(Cypress.env('email'))
    cy.get('#open-text-area').should('be.visible').type(Cypress.env('text-area'))

    cy.get('#phone').type('teste')
    cy.get('#phone').should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').should('be.visible').type(Cypress.env('firstName'))
    cy.get('#lastName').should('be.visible').type(Cypress.env('lastName'))
    cy.get('#email').should('be.visible').type(Cypress.env('email'))
    cy.get('#open-text-area').should('be.visible').type(Cypress.env('text-area'))

    cy.get("[type='checkbox']").last().check()
    cy.validateErrorMessage()
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').should('be.visible').type(Cypress.env('firstName'))
    cy.get('#lastName').should('be.visible').type(Cypress.env('lastName'))
    cy.get('#email').should('be.visible').type(Cypress.env('email'))
    cy.get('#open-text-area').should('be.visible').type(Cypress.env('text-area'))

    cy.get('#firstName').clear()
    cy.get('#lastName').clear()
    cy.get('#email').clear()
    cy.get('#phone').clear()
    cy.get('#open-text-area').clear()

    cy.get('#firstName').should('have.value', '')
    cy.get('#lastName').should('have.value', '')
    cy.get('#email').should('have.value', '')
    cy.get('#phone').should('have.value', '')
    cy.get('#open-text-area').should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.validateErrorMessage()
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    const data = {
      firstName: 'Mole',
      lastName: 'Canela',
      email: 'molecanela@gmail.com',
      text: 'Teste'
    }

    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube')
    cy.get('#product').should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('Mentoria')
    cy.get('#product').should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1)
    cy.get('#product').should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get("[type='radio']").check('feedback')
    cy.get("input[value='feedback']").should('be.checked')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get("[type='radio']").each(($elemento, index, $list) => {
      cy.get($elemento).check()
      cy.get($elemento).should('be.checked')
    })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get("[type='checkbox']").each(($elemento, index, $list) => {
      cy.get($elemento).check()
      cy.get($elemento).should('be.checked')
    })
    cy.get("[type='checkbox']").last().uncheck()
    cy.get("[type='checkbox']").last().should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json')
    .should(input => {
      console.log(input[0].files[0].name)
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload', { action: 'drag-drop' })
    .selectFile('cypress/fixtures/example.json')
    .should(input => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json', null).as('meu_arquivo')
    cy.get('#file-upload')
    .selectFile('@meu_arquivo')
    .should(input => {
      console.log(input[0].files[0].name)
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a').should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a').invoke('removeAttr', 'target')
    cy.get('a').should('not.have.attr', 'target', '_blank')
    cy.get('a').click()
    cy.contains('#title','CAC TAT - Política de Privacidade').should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')

    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche o campo da área de texto usando o comando invoke', () => {
    cy.get('#firstName').invoke('val', 'Paulo')
    cy.get('#lastName').invoke('val', 'Rocha')
    cy.get('#email').invoke('val', 'Paulo@gmail')
    cy.get('#open-text-area').invoke('val', 'PauloPaulada')

    cy.get('#firstName').should('have.value', 'Paulo')
    cy.get('#lastName').should('have.value', 'Rocha')
    cy.get('#email').should('have.value', 'Paulo@gmail')
    cy.get('#open-text-area').should('have.value', 'PauloPaulada')
  })

  it('faz uma requisição HTTP', () => {
    cy.request('GET', 'https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html').as('response')
      .its('status').should('be.equal', 200)

    cy.get('@response')
      .its('statusText').should('be.equal', 'OK')

    cy.get('@response')
      .its('body').should('include', 'CAC TAT')
  })

  it('achar o gato', () => {
    cy.get("#cat").invoke('show').should('have.attr', 'style', 'display: block;').should('be.visible', 'true')
  })
})