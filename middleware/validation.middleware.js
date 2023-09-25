/**
 * Validate a request body/params with Joi schemas
 * If there is a validationError, this function will jump to error handler
 * Otherwise it will pass to controllers
 * @param {JoiSchema} schema Validation Schema
 * @param {string} value Par of the request to be validated (body|params|query)
 */
const validate = (schema, value) => async (req, res, next) => {
  const validation = schema.validate(req[value], { abortEarly: false });
  const { error: validationError } = validation;
  if (validationError) {
    const { details } = validationError;
    const response = details.map(({ message }) => message).join(", ");
    const error = new Error(response);
    error.status = 400;
    return next(error);
  }
  return next();
};

module.exports = { validate };
