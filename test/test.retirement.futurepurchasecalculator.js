/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

let token; '';

describe('Test Future Purchase Calculator API', () => {
  it('Should Test User login and get Token ID on /user/login POST', (done) => {
    chai.request(server)
      .post('/api/user/login')
      .send({
        email: 'gatesnet@gmail.com',
        password: 'Amman@123',
      })
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  it('Should list  Future Purchase Calculator on /getfuturepurchasecalculator/:startDateOfInvestmentHorizon/:endDateOfInvestmentHorizon/:depositRate/:frequencyOfDepositRate/:purchaseCost/:currentBalance/:expectedNominalReturnDuringInvestmentHorizon/:inflationAssumptionDuringInvestmentHorizon GET', (done) => {
    chai.request(server)
      .get('/api/retirement/getfuturepurchasecalculator/24/20000/1000/55/1000/0.02/30/0.05')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});