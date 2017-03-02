class Controller {
  requiredMethods = ['displayName', 'shouldInit', 'initialize']

  constructor(props) {
    const propKeys = Object.keys(props);
    this.validate(propKeys);

    propKeys.forEach((propKey) => {
      const prop = props[propKey];

      this[propKey] = prop;
    });

    this.validate = this.validate.bind(this);
  }

  validate(propKeys) {
    const validateMethod = (method) => propKeys.includes(method) || method;
    const validations = this.requiredMethods.map(validateMethod);
    const isValidInstance = validations.every((validation) => validation === true);

    if (!isValidInstance) {
      const missingMethods = validations.filter((result) => typeof result === 'string');

      throw new Error(`Invalid instance of Controller, missing ${missingMethods}`);
    }
  }
}

export default Controller;
