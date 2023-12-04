import pkg from "mongoose";
const { models } = pkg;

export default function validator(
  requestValidator = null,
  documentValidator = null,
) {
  return async (req, res, next) => {
    try {
      const errors = [];

      if (requestValidator !== null) {
        const pass = await validateRequest(
          res,
          req.body,
          requestValidator,
          errors,
        );
        if (pass === false) return;
      }
      if (documentValidator !== null) {
        // building the query to get the document
        const query = {};
        if (documentValidator.querys) {
          // walk through the querys and add them to the query object, if the querys have a value, use it, if not, use the param from the request
          for (const incomingQuery of documentValidator.querys) {
            query[incomingQuery.field] = incomingQuery.value
              ? incomingQuery.value === "userId"
                ? req.user.id
                : incomingQuery.value
              : req.params[incomingQuery.param];
          }
        } else {
          query._id =
            req.params[documentValidator.model.toString().toLowerCase() + "Id"];
        }
        const pass = await validateDocument(
          res,
          documentValidator.model,
          query,
          documentValidator.populate,
          documentValidator.validator,
          errors,
        );
        if (pass === false) return;
        else req[documentValidator.model.toLowerCase()] = pass;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

async function validateRequest(res, body, validate, errors) {
  await validate(body, errors);
  if (errors.length > 0) {
    res.status(422).json({ errors });
    return false;
  }
}

async function validateDocument(res, model, query, populate, validate, errors) {
  const document =
    populate?.length > 0
      ? await models[model].findOne(query).populate(populate)
      : await models[model].findOne(query);
  if (!document) {
    res.status(404).json({ message: `${model} not found` });
    return false;
  }
  if (validate) await validate(document, errors);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return false;
  }
  return document;
}
