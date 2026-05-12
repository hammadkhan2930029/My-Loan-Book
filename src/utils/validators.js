const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s\-()]{10,20}$/;
const localPhoneDigitsPattern = /^[1-9][0-9]{6,14}$/;

export const authValidationRules = {
  fullName: {
    required: 'Full name is required.',
    minLength: {
      value: 3,
      message: 'Full name must be at least 3 characters.',
    },
    validate: value =>
      value.trim().split(' ').length >= 2 || 'Enter at least first and last name.',
  },
  email: {
    required: 'Email is required.',
    pattern: {
      value: emailPattern,
      message: 'Enter a valid email address.',
    },
  },
  phone: {
    required: 'Phone number is required.',
    validate: value => {
      const digits = String(value || '').replace(/\D/g, '');

      if (!digits) {
        return 'Phone number is required.';
      }

      if (!localPhoneDigitsPattern.test(digits)) {
        return 'Enter digits only, without starting 0.';
      }

      return true;
    },
  },
  internationalPhone: {
    required: 'Phone number is required.',
    pattern: {
      value: phonePattern,
      message: 'Enter a valid phone number.',
    },
    validate: value => {
      const digits = String(value || '').replace(/\D/g, '');
      return digits.length >= 10 || 'Phone number must have at least 10 digits.';
    },
  },
  password: {
    required: 'Password is required.',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters.',
    },
  },
};

export const getConfirmPasswordRules = getValues => ({
  required: 'Please confirm your password.',
  validate: value => value === getValues('password') || 'Passwords do not match.',
});
