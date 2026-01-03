// Takes a validation error object and turns it into a clean, readable error message
export const formatValidationError = errors => {
  if (!errors || !errors.issues) return 'Validation failed';

  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(', ');

  return JSON.stringify(errors);
};
