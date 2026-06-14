import { Validator } from "./validators";
import { EnvValidationError, EnvErrorDetail } from "./errors";

export * from "./validators";
export * from "./errors";

export type EnvSchema = Record<string, Validator<any>>;

export type InferEnv<S extends EnvSchema> = {
  [K in keyof S]: S[K] extends Validator<infer T> ? T : never;
};

export interface CreateEnvOptions {
  source?: Record<string, string | undefined>;
}

export function createEnv<S extends EnvSchema>(schema: S, options: CreateEnvOptions = {}): InferEnv<S> {
  const source = options.source || process.env;
  const result: any = {};
  const errors: EnvErrorDetail[] = [];

  for (const [key, validator] of Object.entries(schema)) {
    try {
      result[key] = validator.parse(source[key]);
    } catch (err: any) {
      errors.push({ key, message: err.message });
    }
  }

  if (errors.length > 0) {
    throw new EnvValidationError(errors);
  }

  return result as InferEnv<S>;
}
