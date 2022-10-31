import { validateDslExpression } from "../utils/dsl";

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
});
