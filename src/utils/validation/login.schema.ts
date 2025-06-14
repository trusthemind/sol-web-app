import * as yup from "yup";

export type LoginFormData = {
  email: string;
  password: string;
};
export const createLoginSchema = (t: any) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("validation.email.invalid"))
      .required(t("validation.email.required")),
    password: yup
      .string()
      .min(6, t("validation.password.minLength"))
      .required(t("validation.password.required")),
  });
