import { DSL } from "../models";
import { DSLSchema } from "../schemas";

type ValidResponse = {
  kind: "valid";
  data: DSL;
};

type InvalidResponse = {
  kind: "invalid";
  error: "invalid-json" | "schema-fail";
};

type Response = ValidResponse | InvalidResponse;

export function validateDslExpression(dslExpression: string): Response {
  let parsedJson: DSL;

  try {
    parsedJson = JSON.parse(dslExpression);
  } catch {
    return { kind: "invalid", error: "invalid-json" };
  }

  const parsedDsl = DSLSchema.safeParse(parsedJson);

  if (parsedDsl.success === false) {
    return { kind: "invalid", error: "schema-fail" };
  }

  return { kind: "valid", data: parsedJson };
}
