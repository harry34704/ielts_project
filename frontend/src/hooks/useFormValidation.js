import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((fieldValues = values) => {
    const validationErrors = {};

    Object.keys(validationRules).forEach(field => {
      if (field in fieldValues) {
        const rules = validationRules[field];
        const value = fieldValues[field];
        
        if (rules.required && !value) {
          validationErrors[field] = 'This field is required';
        } else if (rules.minLength && value.length < rules.minLength) {
          validationErrors[field] = `Minimum ${rules.minLength} characters required`;
        } else if (rules.pattern && !rules.pattern.test(value)) {
          validationErrors[field] = rules.message || 'Invalid format';
        } else if (rules.custom) {
          const customError = rules.custom(value, fieldValues);
          if (customError) {
            validationErrors[field] = customError;
          }
        }
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [validationRules, values]);

  const handleChange = (field) => (event) => {
    const value = event.target?.value ?? event;
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (touched[field]) {
      validate({ [field]: value });
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validate({ [field]: values[field] });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate: () => validate(values),
    resetForm
  };
}; 