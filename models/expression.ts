export type Argument = string | number | Expression;

export interface Expression {
  fn: string;
  a: Argument;
  b: Argument;
}
