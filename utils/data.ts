import attributes from "../data/attributes.json";
import facts from "../data/facts.json";
import securities from "../data/securities.json";

export const securitiesMap = new Map<string, number>(
  securities.map(({ id, symbol }) => [symbol, id]),
);

export const attributesMap = new Map<string, number>(
  attributes.map(({ id, name }) => [name, id]),
);

export const factsMap = new Map<string, number>(
  facts.map(({ attribute_id, security_id, value }) => [
    // JS map keys work off referential equality, meaning we need to use a primitive for the key. Simplest way is to construct a unique string from the values
    `${attribute_id}|${security_id}`,
    value,
  ]),
);
