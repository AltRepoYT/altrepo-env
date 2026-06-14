import { describe, it, expect } from "vitest";
import { createEnv, str, num, bool, url, EnvValidationError } from "../src/index";

describe("@altrepo/env", () => {
  it("should parse valid environment variables", () => {
    const env = createEnv(
      {
        NODE_ENV: str({ choices: ["development", "production"], default: "development" }),
        PORT: num({ default: 3000, min: 1, max: 65535 }),
        DATABASE_URL: url(),
        ENABLE_CACHE: bool({ default: false }),
        DEBUG: bool(),
      },
      {
        source: {
          NODE_ENV: "production",
          PORT: "8080",
          DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
          ENABLE_CACHE: "true",
          DEBUG: "yes",
        },
      }
    );

    expect(env.NODE_ENV).toBe("production");
    expect(env.PORT).toBe(8080);
    expect(env.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
    expect(env.ENABLE_CACHE).toBe(true);
    expect(env.DEBUG).toBe(true);
  });

  it("should handle defaults correctly", () => {
    const env = createEnv(
      {
        NODE_ENV: str({ choices: ["development", "production"], default: "development" }),
        PORT: num({ default: 3000 }),
        ENABLE_CACHE: bool({ default: false }),
      },
      {
        source: {}, // Empty source
      }
    );

    expect(env.NODE_ENV).toBe("development");
    expect(env.PORT).toBe(3000);
    expect(env.ENABLE_CACHE).toBe(false);
  });

  it("should parse boolean variations correctly", () => {
    const truthySource = { A: "true", B: "1", C: "yes", D: "on" };
    const falsySource = { A: "false", B: "0", C: "no", D: "off" };

    const truthyEnv = createEnv(
      { A: bool(), B: bool(), C: bool(), D: bool() },
      { source: truthySource }
    );
    expect(truthyEnv.A).toBe(true);
    expect(truthyEnv.B).toBe(true);
    expect(truthyEnv.C).toBe(true);
    expect(truthyEnv.D).toBe(true);

    const falsyEnv = createEnv(
      { A: bool(), B: bool(), C: bool(), D: bool() },
      { source: falsySource }
    );
    expect(falsyEnv.A).toBe(false);
    expect(falsyEnv.B).toBe(false);
    expect(falsyEnv.C).toBe(false);
    expect(falsyEnv.D).toBe(false);
  });

  it("should throw combined errors for missing or invalid variables", () => {
    expect(() => {
      createEnv(
        {
          NODE_ENV: str({ choices: ["development", "production"] }), // Missing, no default
          PORT: num({ min: 1000 }), // Invalid min
          DATABASE_URL: url(), // Invalid URL
          ENABLE_CACHE: bool(), // Invalid boolean
        },
        {
          source: {
            PORT: "80",
            DATABASE_URL: "not-a-url",
            ENABLE_CACHE: "perhaps",
          },
        }
      );
    }).toThrowError(EnvValidationError);

    try {
      createEnv(
        {
          NODE_ENV: str({ choices: ["development", "production"] }),
          PORT: num({ min: 1000 }),
        },
        {
          source: {
            NODE_ENV: "invalid_choice",
            PORT: "80",
          },
        }
      );
    } catch (e: any) {
      expect(e).toBeInstanceOf(EnvValidationError);
      expect(e.details).toHaveLength(2);
      expect(e.details[0].key).toBe("NODE_ENV");
      expect(e.details[1].key).toBe("PORT");
    }
  });
});
