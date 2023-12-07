const Joi = require("joi");

exports.userSchemaValidate = (_reqBody) => {
  let userValidate = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return userValidate.validate(_reqBody);
};

exports.userLoginValidate = (_reqBody) => {
  let userValidate = Joi.object({
    email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return userValidate.validate(_reqBody);
};
