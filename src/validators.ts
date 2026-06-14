export interface Validator<T> {
  parse(value: string | undefined): T;
}

export interface StrOptions<T extends string> {
  default?: T;
  choices?: T[];
  customErrorMessage?: string;
}

export function str<T extends string = string>(options: StrOptions<T> = {}): Validator<T> {
  return {
    parse(value: string | undefined): T {
      if (value === undefined || value.trim() === "") {
        if (options.default !== undefined) {
          return options.default;
        }
        throw new Error(options.customErrorMessage || "Missing required string value");
      }
      
      const strVal = value as T;
      if (options.choices && !options.choices.includes(strVal)) {
        throw new Error(options.customErrorMessage || `Invalid choice: "${value}". Expected one of: ${options.choices.join(", ")}`);
      }
      
      return strVal;
    }
  };
}

export interface NumOptions {
  default?: number;
  min?: number;
  max?: number;
  customErrorMessage?: string;
}

export function num(options: NumOptions = {}): Validator<number> {
  return {
    parse(value: string | undefined): number {
      if (value === undefined || value.trim() === "") {
        if (options.default !== undefined) {
          return options.default;
        }
        throw new Error(options.customErrorMessage || "Missing required numeric value");
      }
      
      const parsed = Number(value);
      if (Number.isNaN(parsed)) {
        throw new Error(options.customErrorMessage || `Invalid number format: "${value}"`);
      }
      
      if (options.min !== undefined && parsed < options.min) {
        throw new Error(options.customErrorMessage || `Number must be >= ${options.min}`);
      }
      if (options.max !== undefined && parsed > options.max) {
        throw new Error(options.customErrorMessage || `Number must be <= ${options.max}`);
      }
      
      return parsed;
    }
  };
}

export interface BoolOptions {
  default?: boolean;
  customErrorMessage?: string;
}

export function bool(options: BoolOptions = {}): Validator<boolean> {
  return {
    parse(value: string | undefined): boolean {
      if (value === undefined || value.trim() === "") {
        if (options.default !== undefined) {
          return options.default;
        }
        throw new Error(options.customErrorMessage || "Missing required boolean value");
      }
      
      const lower = value.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(lower)) {
        return true;
      }
      if (["false", "0", "no", "off"].includes(lower)) {
        return false;
      }
      
      throw new Error(options.customErrorMessage || `Invalid boolean format: "${value}"`);
    }
  };
}

export interface UrlOptions {
  default?: string;
  customErrorMessage?: string;
}

export function url(options: UrlOptions = {}): Validator<string> {
  return {
    parse(value: string | undefined): string {
      if (value === undefined || value.trim() === "") {
        if (options.default !== undefined) {
          return options.default;
        }
        throw new Error(options.customErrorMessage || "Missing required URL value");
      }
      
      try {
        new URL(value);
      } catch (err) {
        throw new Error(options.customErrorMessage || `Invalid URL format: "${value}"`);
      }
      
      return value;
    }
  };
}
