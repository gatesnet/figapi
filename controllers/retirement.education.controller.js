/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const Joi = require('joi');
const { pv, pmt } = require('financial');

// Get Client Retirement Calculators Controller
exports.getEducation = async function (req, res) {
  try {
    // Validation
    const schema = Joi.object({
      yearsUntilEducationPaymentsStart: Joi.number().required(),
      lengthOfEducationPayments: Joi.number().required(),
      frequencyOfPayments: Joi.string().required(),
      freuencyOfContributionToPortfolio: Joi.string().required(),
      valueOfSinglePayment: Joi.number().required(),
      currentBalance: Joi.number().required(),
      // expectedReturn: Joi.number().required(),
      inflationAssumption: Joi.number().required(),

    });

    const results = schema.validate(req.params);
    if (results.error) {
      res.status(400).send(results.error.details[0].message);
      return;
    }

    const yearsUntilEducationPaymentsStart = parseFloat(req.params.yearsUntilEducationPaymentsStart, 10);
    const lengthOfEducationPayments = parseFloat(req.params.lengthOfEducationPayments, 10);
    const { frequencyOfPayments } = req.params;
    const { freuencyOfContributionToPortfolio } = req.params;
    const valueOfSinglePayment = parseFloat(req.params.valueOfSinglePayment, 10);
    const currentBalance = parseFloat(req.params.currentBalance, 10);
    // const expectedReturn = parseFloat(req.params.expectedReturn, 10);
    const inflationAssumption = parseFloat(req.params.inflationAssumption, 10)/100;

    //let expectedRealReturn = 0;
    let PVOfEducationRequirements = 0;
    let requiredContribution = 0;

    // expectedRealReturn = (1 + expectedReturn) / (1 + inflationAssumption) - 1;

    //   monthly , Quarterly , SemiAnnual , Annual cal
    if (frequencyOfPayments.toUpperCase() === 'MONTHLY') {
      PVOfEducationRequirements = pv(inflationAssumption / 12, lengthOfEducationPayments, valueOfSinglePayment, 0, 0);
    } else if (frequencyOfPayments.toUpperCase() === 'QUARTERLY') {
      PVOfEducationRequirements = pv(inflationAssumption / 4, lengthOfEducationPayments, valueOfSinglePayment, 0, 0);
    } else if (frequencyOfPayments.toUpperCase() === 'SEMIANNUAL') {
      PVOfEducationRequirements = pv(inflationAssumption / 2, lengthOfEducationPayments, valueOfSinglePayment, 0, 0);
    } else if (frequencyOfPayments.toUpperCase() === 'ANNUAL') {
      PVOfEducationRequirements = pv(inflationAssumption, lengthOfEducationPayments, valueOfSinglePayment, 0, 0);
    }

    if (freuencyOfContributionToPortfolio.toUpperCase() === 'MONTHLY') {
      requiredContribution = pmt(inflationAssumption / 12, yearsUntilEducationPaymentsStart * 12, currentBalance, PVOfEducationRequirements, 0);
    } else if (freuencyOfContributionToPortfolio.toUpperCase() === 'QUARTERLY') {
      requiredContribution = pmt(inflationAssumption / 4, yearsUntilEducationPaymentsStart * 4, currentBalance, PVOfEducationRequirements, 0);
    } else if (freuencyOfContributionToPortfolio.toUpperCase() === 'SEMIANNUAL') {
      requiredContribution = pmt(inflationAssumption / 2, yearsUntilEducationPaymentsStart * 2, currentBalance, PVOfEducationRequirements, 0);
    } else if (freuencyOfContributionToPortfolio.toUpperCase() === 'ANNUAL') {
      requiredContribution = pmt(inflationAssumption, yearsUntilEducationPaymentsStart, currentBalance, PVOfEducationRequirements, 0);
    }
    // eslint-disable-next-line no-undef
    //requiredMonthlyContribution = pmt(expectedRealReturn / 12, yearsUntilCharityPaymentsStart * 12, currentBalance, PVOfCharityRequirements, 0);

    return res.status(200).send({ requiredContribution });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
