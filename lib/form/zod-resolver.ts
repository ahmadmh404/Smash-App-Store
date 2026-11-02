import type {
  FieldValues,
  ResolverResult,
  ResolverOptions,
} from "react-hook-form";

import * as z from "zod";

export function zodResolver<T extends z.ZodType<any, any, any>>(
  schema: T,
  schemaOptions?: Partial<z.ParseParams>,
  resolverOptions?: {
    mode?: "async" | "sync";
    rawValues?: boolean;
  }
) {
  return async (
    values: FieldValues,
    context: any,
    options: ResolverOptions<FieldValues>
  ): Promise<ResolverResult<z.infer<T>>> => {
    try {
      const data = await schema.parseAsync(values, schemaOptions);

      return {
        values: resolverOptions?.rawValues ? values : data,
        errors: {},
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, any> = {};

        for (const issue of error.issues) {
          const path = issue.path.join(".");
          if (!fieldErrors[path]) {
            fieldErrors[path] = {
              type: issue.code,
              message: issue.message,
            };
          }
        }

        return {
          values: {},
          errors: fieldErrors,
        };
      }

      throw error;
    }
  };
}

// Enhanced step validation with Zod integration
export async function validateStepSchema<T extends z.ZodType<any, any, any>>(
  schema: T,
  values: any,
  stepFields: string[]
): Promise<{ isValid: boolean; errors: Record<string, any> }> {
  try {
    // Extract only the fields for this step
    const stepValues = stepFields.reduce((acc, field) => {
      const fieldPath = field.split(".");
      let current = values;
      let target = acc;

      // Navigate nested paths
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const key = fieldPath[i];
        if (!(key in current)) return acc;
        current = current[key];
        if (!(key in target)) target[key] = {};
        target = target[key];
      }

      const finalKey = fieldPath[fieldPath.length - 1];
      if (finalKey in current) {
        target[finalKey] = current[finalKey];
      }

      return acc;
    }, {} as any);

    await schema.parseAsync(stepValues);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, any> = {};

      for (const issue of error.issues) {
        const path = issue.path.join(".");
        // Only include errors for fields in this step
        if (stepFields.includes(path)) {
          fieldErrors[path] = {
            type: issue.code,
            message: issue.message,
          };
        }
      }

      return {
        isValid: Object.keys(fieldErrors).length === 0,
        errors: fieldErrors,
      };
    } else {
      return { isValid: false, errors: { _form: "Validation error" } };
    }
  }
}

// Create a partial schema for step validation
export function createStepSchema<T extends z.ZodType<any, any, any>>(
  fullSchema: T,
  stepFields: string[]
): z.ZodType<any, any, any> {
  if (fullSchema instanceof z.ZodObject) {
    const shape = fullSchema.shape;
    const stepShape: Record<string, any> = {};

    stepFields.forEach((field) => {
      if (field in shape) {
        stepShape[field] = shape[field];
      }
    });

    return z.object(stepShape);
  }

  // Fallback to partial schema
  return fullSchema.partial();
}

// Combine multiple step schemas into a single schema
export function combineStepSchemas<T extends z.ZodType<any, any, any>[]>(
  ...schemas: T
): z.ZodIntersection<T[0], T[1]> | T[0] {
  if (schemas.length === 0) {
    return z.object({}) as any;
  }

  if (schemas.length === 1) {
    return schemas[0] as any;
  }

  return schemas.reduce((acc, schema) => {
    return acc.and(schema);
  }) as any;
}

// Extract field names from a Zod schema
export function extractFieldNamesFromSchema(
  schema: z.ZodType<any, any, any>
): string[] {
  const fieldNames: string[] = [];

  if (schema instanceof z.ZodObject) {
    Object.keys(schema.shape).forEach((key) => {
      fieldNames.push(key);
    });
  } else if (schema instanceof z.ZodIntersection) {
    // Handle intersection types
    const leftFields = extractFieldNamesFromSchema(schema._def.left);
    const rightFields = extractFieldNamesFromSchema(schema._def.right);
    fieldNames.push(...leftFields, ...rightFields);
  } else if (schema instanceof z.ZodUnion) {
    // Handle union types - take fields from first option
    if (schema._def.options.length > 0) {
      const firstOptionFields = extractFieldNamesFromSchema(
        schema._def.options[0]
      );
      fieldNames.push(...firstOptionFields);
    }
  }

  return [...new Set(fieldNames)]; // Remove duplicates
}

// Validate entire form across all steps
export async function validateMultiStepForm<T extends z.ZodType<any, any, any>>(
  schema: T,
  values: any,
  steps: Array<{ schema?: z.ZodType<any, any, any>; fields?: string[] }>
): Promise<{
  isValid: boolean;
  errors: Record<string, any>;
  stepErrors: Record<number, Record<string, any>>;
}> {
  const stepErrors: Record<number, Record<string, any>> = {};
  let allErrors: Record<string, any> = {};

  // Validate each step individually
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.schema && step.fields) {
      const stepValidation = await validateStepSchema(
        step.schema,
        values,
        step.fields
      );
      if (!stepValidation.isValid) {
        stepErrors[i] = stepValidation.errors;
        allErrors = { ...allErrors, ...stepValidation.errors };
      }
    }
  }

  // Validate against full schema
  try {
    await schema.parseAsync(values);
  } catch (error) {
    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        const path = issue.path.join(".");
        allErrors[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }
  }

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
    stepErrors,
  };
}
