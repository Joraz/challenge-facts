import { Argument, DSL, Expression } from "../models";
import { DSLSchema } from "../schemas";
import { attributesMap, factsMap, securitiesMap } from "./data";

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

export function evaluateDslExpression({ expression, security }: DSL): number {
  const { a, b, fn } = expression;

  const securityId = securitiesMap.get(security);

  // The schema validation should have already handled checking securities/attributes, so this is mostly to make TS happy
  if (!securityId) {
    throw new Error(`Could not find security named ${security}`);
  }

  const aValue = getValueFromArgument(a, securityId, security);
  const bValue = getValueFromArgument(b, securityId, security);

  switch (fn) {
    case "+":
      return aValue + bValue;
    case "-":
      return aValue - bValue;
    case "*":
      return aValue * bValue;
    case "/":
      return aValue / bValue;
    default:
      throw new Error(`Unknown operator ${fn}`);
  }
}

function getValueFromArgument(
  argument: Argument,
  securityId: number,
  security: string,
): number {
  if (typeof argument === "number") {
    return argument;
  } else if (typeof argument === "string") {
    const attributeId = attributesMap.get(argument);
    if (!attributeId) {
      throw new Error(`Could not find attribute named ${argument}`);
    }

    const factValue = factsMap.get(`${attributeId}|${securityId}`); // convert the numbers into the same format that we used when creating the keys for the map

    return factValue!;
  } else {
    return evaluateDslExpression({ expression: argument, security });
  }
}
