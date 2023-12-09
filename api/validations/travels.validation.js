const Joi = require("joi");

exports.travelSchemaValidate = (_reqBody) => {
  let travelValidate = Joi.object({
    train_name: Joi.string().max(3).required(),
    ticket: {
      payment_type: Joi.string().max(50).required(),
      price: Joi.number().min(1).max(300).required()
    }
  });

  return travelValidate.validate(_reqBody);
};
