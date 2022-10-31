import { Expression } from "./expression";

export interface DSL {
  security: string;
  expression: Expression;
}
