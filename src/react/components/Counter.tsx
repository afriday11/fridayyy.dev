import { useState } from "react";

type Props = {
  initial?: number;
};

export default function Counter({ initial = 0 }: Props) {
  const [count, setCount] = useState(initial);

  return (
    <div
      className="shadowfx"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "12px",
        background: "#1d1e21",
      }}
    >
      <strong style={{ minWidth: 80 }}>Count: {count}</strong>
      <button
        type="button"
        onClick={() => setCount((c) => c - 1)}
        style={{
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "inherit",
          padding: "0.4rem 0.65rem",
          cursor: "pointer",
        }}
      >
        -1
      </button>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "inherit",
          padding: "0.4rem 0.65rem",
          cursor: "pointer",
        }}
      >
        +1
      </button>
      <button
        type="button"
        onClick={() => setCount(initial)}
        style={{
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "transparent",
          color: "inherit",
          padding: "0.4rem 0.65rem",
          cursor: "pointer",
        }}
      >
        reset
      </button>
    </div>
  );
}


