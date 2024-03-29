/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

let token;

describe('Test Required Monthly contribution API', () => {
  it('Should Test User login and get Token ID on /user/login POST', (done) => {
    chai.request(server)
      .post('/api/user/login')
      .send({
        email: 'api@figinvestment.com',
        password: 'FIG@^*135_0987',
      })
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  it('Should list Required Monthly contribution on /getclientretirementcalculators/:currentAge/:currentSavingsBalance/:monthlyEarnings/:retirementAge/:monthlyExpensesDuringRetirement/:assumedAnnualInflation/:assumedYearsDuringRetirement/:expectedNominalReturnOnAssets GET', (done) => {
    chai.request(server)
      .get('/api/retirement/getclientretirementcalculators/24/20000/1000/55/1000/0.02/30/0.05')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
