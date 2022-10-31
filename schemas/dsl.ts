import { z } from "zod";

import securities from "../data/securities.json";
import { DSL, Expression } from "../models";

const securitiesSet = new Set<string>(securities.map(({ symbol }) => symbol));

const ExpressionSchema: z.ZodType<Expression> = z.lazy(() =>
  z.object({
    fn: z.enum(["+", "-", "*", "/"]),
    a: z.union([z.string(), z.number(), ExpressionSchema]),
    b: z.union([z.string(), z.number(), ExpressionSchema]),
  }),
);

export const DSLSchema: z.ZodType<DSL> = z.object({
  security: z.string().refine((security) => securitiesSet.has(security)),
  expression: ExpressionSchema,
});
