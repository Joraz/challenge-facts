import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";

import { validateDslExpression } from "../utils/dsl";

import styles from "./index.module.css";

interface DSLExample {
  id: string;
  label: string;
  dsl: string;
}

const examples: readonly DSLExample[] = [
  {
    id: "multiply",
    label: "Simple multiplication",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`,
  },
  {
    id: "divide",
    label: "Simple division",
    dsl: `{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`,
  },
  {
    id: "nested",
    label: "Nested expression",
    dsl: `{
  "expression": {
    "fn": "-", 
    "a": {"fn": "-", "a": "eps", "b": "shares"}, 
    "b": {"fn": "-", "a": "assets", "b": "liabilities"}
  },
  "security": "CDE"
}`,
  },
  {
    id: "invalid-json",
    label: "Invalid JSON",
    dsl: `{
  "expression": {"fn": "+", "a": "price", "b": "eps"},
  "security": "BCD"
`,
  },
  {
    id: "invalid-dsl",
    label: "Invalid DSL",
    dsl: `{
  "wrong": 123,
  "security": "BCD"
}`,
  },
  {
    id: "missing-security",
    label: "Missing security",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ZZZ"
}`,
  },
];

const Home: NextPage = () => {
  const [expression, setExpression] = useState<string>(examples[0].dsl);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const setDsl = (dsl: string) => () => {
    setExpression(dsl);
    setShowBanner(false);
  };

  const handleRunClick = () => {
    setShowBanner(true);

    const validatedDsl = validateDslExpression(expression);
    setHasError(validatedDsl.kind === "invalid");
  };

  return (
    <>
      <Head>
        <title>Stockopedia facts challenge</title>
        <meta
          name="description"
          content="Coding challenge for Stockopedia Ltd"
        />
      </Head>

      <main className={styles.container}>
        <h1>Welcome to facts!</h1>
        <p>
          Enter the DSL query below and press the{" "}
          <strong>
            <q>run</q>
          </strong>{" "}
          button to evaluate it.
        </p>

        {/* Pre-canned Examples Section */}
        <div className={styles.section}>
          <p id="pre-canned-description">
            <strong>Pre-canned examples:</strong>
          </p>
          <nav
            className={styles.navigation}
            aria-describedby="pre-canned-description"
          >
            {examples.map(({ id, label, dsl }) => (
              <button
                type="button"
                onClick={setDsl(dsl)}
                key={id}
                data-testid={`button-${id}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* DSL Editor Section */}
        <div className={styles.section}>
          <label htmlFor="dsl-expression">DSL Expression:</label>
          <textarea
            id="dsl-expression"
            className={styles.field}
            data-testid="expression-input"
            placeholder="Enter your DSL"
            value={expression}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setExpression(e.target.value)
            }
            rows={8}
          ></textarea>
          {showBanner === true &&
            (hasError ? (
              <div
                className={[styles.message, styles.messageError].join(" ")}
                data-testid="error-banner"
              >
                There is a problem with your DSL query.
              </div>
            ) : (
              <div
                className={[styles.message, styles.messageSuccess].join(" ")}
                data-testid="success-banner"
              >
                DSL query ran successfully!
              </div>
            ))}

          <button
            data-testid="run-button"
            type="button"
            onClick={handleRunClick}
          >
            Run
          </button>
        </div>

        {/* DSL Output Section */}
        <div className={styles.section}>
          <label htmlFor="dsl-output">Output:</label>
          <textarea
            id="dsl-output"
            className={styles.field}
            readOnly
            rows={1}
          ></textarea>
        </div>
      </main>
    </>
  );
};

export default Home;
