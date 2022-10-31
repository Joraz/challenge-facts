import { z } from "zod";

import { DSL, Expression } from "../models";
import { attributesMap, securitiesMap } from "../utils/data";

const ExpressionSchema: z.ZodType<Expression> = z.lazy(() =>
  z.object({
    fn: z.enum(["+", "-", "*", "/"]),
    a: z.union([
      z.string().refine((attr) => attributesMap.has(attr)),
      z.number(),
      ExpressionSchema,
    ]),
    b: z.union([
      z.string().refine((attr) => attributesMap.has(attr)),
      z.number(),
      ExpressionSchema,
    ]),
  }),
);

export const DSLSchema: z.ZodType<DSL> = z.object({
  security: z.string().refine((security) => securitiesMap.has(security)),
  expression: ExpressionSchema,
});
