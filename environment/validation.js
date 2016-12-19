import { Validator } from 'jsonschema';

import schemas from './schemas';

const validator = new Validator();

schemas.forEach((schema) => validator.addSchema(schema, schema.id));

export default validator;
