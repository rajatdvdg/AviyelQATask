/// <reference types="cypress"/> 
var id

describe('UI Web page validation', () => {
    it('Find all url in the web page and check if the links are valid and exists', () => {
        cy.visit('http://uitestingplayground.com/home')
        cy.get('a').each(page => {              //Iterate through the page to find all hyperlinks.
            cy.request(page.prop('href'))
            .its('status')
            .should('eq',200)                   //Returns success if link is active, else returns failed.
        })
    })
    it('Verify web pages header meta tags for SEO', () => {
        cy.get('meta[name="description"]')      //Checks if there is an attribute called Description in Head tag
          .should("have.attr", "content");     //Checks if there is an attribute called content in description. Expected: Failed execution.
    })                                      //EXPECTED TO FAIL
})

describe('API', () => {
    it('Verify the booking API', () => {
        cy.request('https://restful-booker.herokuapp.com/booking')
        .then((response) => {
            expect(response.status).equal(200)
        })
    }) 

    it('validate CRUD operations - CREATE', () => {
        cy.request({
            method: 'POST', 
            url: 'https://restful-booker.herokuapp.com/booking',
            body: {
            firstname: 'Rajat',
            lastname: 'Devadiga',
            totalprice: '200',
            depositpaid: true,
            bookingdates: {
                checkin: "2017-05-24",
                checkout: "2019-07-30"
                }
            }
        })
        .then((response) => {
            expect(response.status).equal(200)
            id = response.body.bookingid
        })
    })
    it('validate CRUD operations - READ', () => {
        cy.request("https://restful-booker.herokuapp.com/booking/"+id)
            .then((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.not.be.null
        })
    })

    it('validate CRUD operations - UPDATE', () => {
        cy.request({
            method: 'PUT',
            url: "https://restful-booker.herokuapp.com/booking/"+id,
            auth: {
                username: "admin",
                password: "password123"
                },
            body: {
                "firstname" : "RajatTest",
                "lastname" : "Devadiga",
                "totalprice" : '007',
                "depositpaid" : false,
                "bookingdates" : {
                    "checkin" : "2018-01-01",
                    "checkout" : "2019-01-01"
                },
                "additionalneeds" : "Breakfast"
            }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.be.not.null
            expect(response.body).to.have.property('firstname')
        })
    })
    it('validate CRUD operations - DELETE', () => {
        cy.request({
            method: 'DELETE',
            url: "https://restful-booker.herokuapp.com/booking/"+id,
            auth: {
                username: "admin",
                password: "password123"
                },
            failOnStatusCode: false
        }).then((response) =>{
            expect(response.status).equal(201)
        })                 
    })
})