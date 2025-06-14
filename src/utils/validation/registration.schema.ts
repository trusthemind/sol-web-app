import * as yup from "yup";

export const passwordRegex = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex.hasUpperCase,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      passwordRegex.hasLowerCase,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      passwordRegex.hasNumber,
      "Password must contain at least one number"
    )
    .test(
      "password-strength",
      "Password must meet all requirements",
      function (value) {
        if (!value) return false;

        const checks = [
          passwordRegex.minLength.test(value),
          passwordRegex.hasUpperCase.test(value),
          passwordRegex.hasLowerCase.test(value),
          passwordRegex.hasNumber.test(value),
        ];

        const passedChecks = checks.filter(Boolean).length;

        return passedChecks >= 4;
      }
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
export type RegisterFormData = yup.InferType<typeof registerSchema>;
