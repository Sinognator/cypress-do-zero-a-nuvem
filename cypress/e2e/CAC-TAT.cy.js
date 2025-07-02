/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').type('Paulo').should('be.visible')
    cy.get('#lastName').type('Rocha').should('be.visible')
    cy.get('#email').type('pr.moreirarocha@gmail.com').should('be.visible')
    cy.get('#phone').type('61984615119').should('be.visible')
    cy.get('#open-text-area').type('Mensagem aleatória',{delay: 100  }).should('be.visible')
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () =>{
    cy.get('#firstName').type('Paulo').should('be.visible')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('validar que telefone só aceita numeros', () => {
    cy.get('#phone').type('teste').should('be.empty')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário',() =>{
    cy.get('#firstName').type('Paulo').should('be.visible')
    cy.get('#lastName').type('Rocha').should('be.visible')
    cy.get('#email').type('pr.moreirarocha@gmail.com').should('be.visible')
    cy.get('#phone-checkbox').click().should('be.checked')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Paulo').should('have.value', 'Paulo')
    cy.get('#lastName').type('Rocha').should('have.value', 'Rocha')
    cy.get('#email').type('pr.moreirarocha@gmail.com').should('have.value', 'pr.moreirarocha@gmail.com')
    cy.get('#phone').type('61984615119').should('have.value', '61984615119')

    cy.get('#firstName').clear().should('be.empty')
    cy.get('#lastName').clear().should('be.empty')
    cy.get('#email').clear().should('be.empty')
    cy.get('#phone').clear().should('be.empty')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('#phone-checkbox').check().should('be.checked')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('[value="feedback"]').check().should('be.checked')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('[value="feedback"]').check().should('be.checked')
    cy.get('[value="elogio"]').check().should('be.checked')
    cy.get('[value="ajuda"]').check().should('be.checked')
  })

  it('marca ambos checkboxes, depois desmarca o último', () =>{
    cy.get('#email-checkbox').check().should('be.checked')
    cy.get('#phone-checkbox').check().should('be.checked')
    cy.get('[type="checkbox"]').last().uncheck().should('not.be.checked')

  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a').should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a').invoke('removeAttr', 'target').click()
  })
  it('testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de Privacidade')
    cy.get('#title').should('have.text', 'CAC TAT - Política de Privacidade')
  })
})