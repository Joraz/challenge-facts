import { z } from "zod";

import attributes from "../data/attributes.json";
import securities from "../data/securities.json";
import { DSL, Expression } from "../models";

const securitiesSet = new Set<string>(securities.map(({ symbol }) => symbol));
const attributesSet = new Set<string>(attributes.map(({ name }) => name));

const ExpressionSchema: z.ZodType<Expression> = z.lazy(() =>
  z.object({
    fn: z.enum(["+", "-", "*", "/"]),
    a: z.union([
      z.string().refine((attr) => attributesSet.has(attr)),
      z.number(),
      ExpressionSchema,
    ]),
    b: z.union([
      z.string().refine((attr) => attributesSet.has(attr)),
      z.number(),
      ExpressionSchema,
    ]),
  }),
);

export const DSLSchema: z.ZodType<DSL> = z.object({
  security: z.string().refine((security) => securitiesSet.has(security)),
  expression: ExpressionSchema,
});
