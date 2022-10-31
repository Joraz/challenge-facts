import { util } from "prettier";
import { evaluateDslExpression, validateDslExpression } from "../utils/dsl";

describe("Utils", () => {
  describe("validateDslExpression", () => {
    it("returns an invalidresponse when invalid json is supplied", () => {
      const response = validateDslExpression(`
      { 
        "key": "missing brace"
        `);

      expect(response).toEqual({ kind: "invalid", error: "invalid-json" });
    });

    it("returns an invalidresponse when the supplied dsl does not match the schema", () => {
      const response = validateDslExpression(`
        {
          "wrong": 123,
          "security": "BCD"
        }
        `);

      expect(response).toEqual({ kind: "invalid", error: "schema-fail" });
    });

    it("returns an invalidresponse when the supplied dsl contains an incorrect security", () => {
      const response = validateDslExpression(`
      {
        "expression": {"fn": "*", "a": "sales", "b": 2},
        "security": "ZZZ"
      }
      `);

      expect(response).toEqual({ kind: "invalid", error: "schema-fail" });
    });

    it("returns an invalidresponse when the supplied dsl contains an incorrect attribute", () => {
      const response = validateDslExpression(`
      {
        "expression": {"fn": "*", "a": "foo", "b": 2},
        "security": "EFG"
      }
      `);

      expect(response).toEqual({ kind: "invalid", error: "schema-fail" });
    });

    it("returns a validresponse when the supplied dsl is correctly formatted", () => {
      const response = validateDslExpression(`
      {
        "expression": {"fn": "*", "a": "sales", "b": 2},
        "security": "ABC"
      }
      `);

      expect(response).toEqual({
        kind: "valid",
        data: {
          expression: { fn: "*", a: "sales", b: 2 },
          security: "ABC",
        },
      });
    });
  });

  describe("evaluateDslExpression", () => {
    it("throws if an unknown security is supplied", () => {
      expect(() => {
        evaluateDslExpression({
          expression: { fn: "+", a: 1, b: 1 },
          security: "FOO",
        });
      }).toThrow("Could not find security named FOO");
    });

    it("throws if an unknown attribute is found in the expression", () => {
      expect(() => {
        evaluateDslExpression({
          expression: { fn: "+", a: "bar", b: 1 },
          security: "ABC",
        });
      }).toThrow("Could not find attribute named bar");
    });

    it("handles number arguments", () => {
      const output = evaluateDslExpression({
        expression: { fn: "+", a: 1, b: 1 },
        security: "ABC",
      });

      expect(output).toEqual(2);
    });

    it("handles attribute arguments", () => {
      const output = evaluateDslExpression({
        expression: { fn: "+", a: "assets", b: "liabilities" },
        security: "ABC",
      });

      expect(output).toEqual(15);
    });

    it("handles expression arguments", () => {
      const output = evaluateDslExpression({
        expression: {
          fn: "+",
          a: { fn: "+", a: "eps", b: "shares" },
          b: { fn: "+", a: "assets", b: "liabilities" },
        },
        security: "ABC",
      });

      expect(output).toEqual(27);
    });

    it("handles subtraction", () => {
      const output = evaluateDslExpression({
        expression: { fn: "-", a: 10, b: 5 },
        security: "ABC",
      });

      expect(output).toEqual(5);
    });

    it("handles multiplication", () => {
      const output = evaluateDslExpression({
        expression: { fn: "*", a: 7, b: 3 },
        security: "ABC",
      });

      expect(output).toEqual(21);
    });

    it("handles division", () => {
      const output = evaluateDslExpression({
        expression: { fn: "/", a: 21, b: 7 },
        security: "ABC",
      });

      expect(output).toEqual(3);
    });
  });
});
