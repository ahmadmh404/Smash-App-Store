"use client";

import type {
  FormStep,
  FormField,
  LoginSchemaValues,
  registerSchemaType,
} from "@/components/_builders/types/form";
import { userTypeSelectOptoins } from "./constants";
import { LoginSchema, registerSchema } from "@/schemas";

// login form
export const loginFormFields: FormField<LoginSchemaValues>[] = [
  {
    id: "email",
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "johndoe@gamil.com",
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
  },
];

export const loginDefaultValues: Partial<LoginSchemaValues> = {
  email: "",
  password: "",
};

export const LoginFormProps = {
  title: "Login",
  description: "Welcome back",
  schema: LoginSchema,
  defaultValues: loginDefaultValues,
  fields: loginFormFields,
  submitText: "Sign in",
  className: "p-5 bg-background w-full max-w-[400px] shadow-md rounded-lg",
  backButtonConfig: {
    backButtonHref: "/auth/register",
    backButtonLabel: "Don't have an account?",
  },
  submitButtonProps: {
    className: "w-full py-2 primary-button-gradient",
  },
};

// register form
export const registerSteps: FormStep<registerSchemaType>[] = [
  {
    id: "first",
    title: "Sign up",
    description: "Create an account",
    fields: [
      {
        id: "name",
        name: "name",
        type: "text",
        placeholder: "John Doe",
        label: "Full name",
      },
      {
        id: "email",
        name: "email",
        type: "email",
        placeholder: "john@doe.com",
        label: "Email Address",
      },
      {
        id: "password",
        name: "password",
        type: "password",
        placeholder: "*******",
        label: "Password",
      },
    ],
  },

  {
    id: "second",
    title: "Sign up",
    description: "Create an account",
    fields: [
      {
        id: "avatar",
        name: "avatar",
        type: "avatar",
        label: "Avatar",
      },
      {
        id: "type",
        name: "type",
        type: "select",
        label: "Role",
        options: userTypeSelectOptoins,
        inputClassName: "w-full flex",
        placeholder: "Select a role",
      },
    ],
  },
];

export const registerDefaultValues: Partial<registerSchemaType> = {
  name: "",
  password: "",
  avatar: undefined,
  email: "",
};

export const registerFormProps = {
  schema: registerSchema,
  steps: registerSteps,
  defaultValues: registerDefaultValues,
  showStepProgress: false,
  showStepNavigation: true,
  allowStepNavigation: true,
  validateStepOnNext: true,
  submitText: "Sign up",
  className: "p-5 bg-background w-full max-w-[400px] shadow-md rounded-lg",
  descriptionClassName: "text-center",
  backButtonConfig: {
    backButtonHref: "/auth/login",
    backButtonLabel: "Already have an account?",
  },
  nextButtonProps: {
    className: "ms-auto py-2 primary-button-gradient",
  },

  submitButtonProps: {
    className: "py-2 primary-button-gradient",
  },
};
