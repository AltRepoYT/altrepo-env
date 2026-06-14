export interface EnvErrorDetail {
  key: string;
  message: string;
}

export class EnvValidationError extends Error {
  public details: EnvErrorDetail[];

  constructor(details: EnvErrorDetail[]) {
    const lines = details.map((d) => `  - ${d.key}: ${d.message}`);
    const message = `Environment Validation Failed:\n${lines.join("\n")}`;
    super(message);
    this.name = "EnvValidationError";
    this.details = details;
    Object.setPrototypeOf(this, EnvValidationError.prototype);
  }
}
