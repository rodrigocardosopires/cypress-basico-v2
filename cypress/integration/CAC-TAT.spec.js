///<reference types="Cypress"/>

describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach( () => {
        cy.visit('./src/index.html')
    })
    it('Verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    });

    it('Preenche os campos obrigatórios e envia o formulário', () => {
        const longText = 'Lorem ipsum dictumst elementum porttitor ullamcorper diam posuere porta, risus tortor phasellus tempor lacinia erat taciti ad integer, dictumst class proin mauris duis quam imperdiet. mi lacus ac at euismod phasellus proin primis feugiat, rutrum tincidunt himenaeos vitae inceptos sapien egestas quisque tortor, aliquam maecenas arcu quis luctus sed tempor. hac at metus laoreet tincidunt turpis dictum nam odio, rhoncus malesuada nisi hendrerit tristique ad ut mi, nec libero est curae nibh enim leo pretium, donec risus tempus taciti porta morbi fermentum. ad vestibulum potenti accumsan aliquam nullam augue dolor velit faucibus dictum iaculis purus dictum hendrerit porttitor, lacus duis cursus torquent dapibus condimentum nulla justo netus fermentum laoreet massa euismod magna, interdum quisque dolor neque porta volutpat cubilia etiam nostra hac vivamus gravida aliquet lacus.'
        cy.get('#firstName').type('Rodrigo')
        cy.get('#lastName').type('Pires')
        cy.get('#email').type('rodrigocardosopires@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
    });

    it('Mensagem de erro ao submeter o formulário com um e-mail com formatação inválida', () => {
        cy.get('#firstName').type('Rodrigo')
        cy.get('#lastName').type('Pires')
        cy.get('#email').type('rodrigocardosopiresgmail.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('Campo telefone continua vazio quando preenchido com valor não numérico', () => {
        cy.get('#phone').type('abcdefghij').should('have.value', '')
    });

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', () => {
        cy.get('#firstName').type('Rodrigo')
        cy.get('#lastName').type('Pires')
        cy.get('#email').type('rodrigocardosopires@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('Preenche e limpa os campos nome, sobrenome, e-mail e telefone', () => {
        cy.get('#firstName').type('Rodrigo').should('have.value', 'Rodrigo').clear().should('have.value', '')
        cy.get('#lastName').type('Pires').should('have.value', 'Pires').clear().should('have.value', '')
        cy.get('#email').type('rodrigocardosopires@gmail.com').should('have.value', 'rodrigocardosopires@gmail.com').clear().should('have.value', '')
        cy.get('#phone').type(21979178386).should('have.value', 21979178386).clear().should('have.value', '')
    });

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    });

    it('Envia o formulário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    });

    it('Selecione um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    });

    it('Selecione um produto (Mentoria) por seu valor', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    });

    it('Selecione um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    });

    it('Marca o tipo atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
    });

    it('Marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]').should('have.length', 3)
        .each (function($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    });

    it('Marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    });

    it('Seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });

    it('Seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });

    it('Seleciona um arquivo selecionando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]').selectFile('@sampleFile')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });
});