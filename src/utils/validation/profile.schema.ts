import * as yup from "yup";

export const deleteAccountSchema = yup.object({
  password: yup.string().when("$step", {
    is: 2,
    then: (schema) =>
      schema
        .required("Password is required to delete account")
        .min(1, "Password cannot be empty"),
    otherwise: (schema) => schema.optional(),
  }),

  confirmation: yup.string().when("$step", {
    is: 1,
    then: (schema) =>
      schema
        .required('Please type "DELETE" to confirm')
        .oneOf(
          ["DELETE"],
          'You must type "DELETE" exactly to confirm account deletion'
        ),
    otherwise: (schema) => schema.optional(),
  }),

  reason: yup
    .string()
    .optional()
    .nullable()
    .max(500, "Reason must not exceed 500 characters"),
});

export const deleteAccountSchemaSimple = yup.object({
  confirmation: yup.string().optional(),
});

export const updateProfileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  phone: yup.string().optional(),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Current password is required")
    .min(1, "Current password cannot be empty"),

  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    )
    .test(
      "not-same",
      "New password must be different from current password",
      function (value) {
        return value !== this.parent.currentPassword;
      }
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export const avatarUploadSchema = yup.object({
  file: yup
    .mixed()
    .required("Please select a file")
    .test("fileSize", "File size must be less than 5MB", (value: any) => {
      return value && value.size <= 5 * 1024 * 1024;
    })
    .test(
      "fileType",
      "Only image files are allowed (JPEG, PNG, GIF, WebP)",
      (value: any) => {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        return value && allowedTypes.includes(value.type);
      }
    ),
});

export type DeleteAccountFormData = yup.InferType<
  typeof deleteAccountSchemaSimple
>;
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
export type AvatarUploadFormData = yup.InferType<typeof avatarUploadSchema>;

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (@$!%*?&)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
