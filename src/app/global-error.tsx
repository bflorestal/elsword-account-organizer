"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily:
            "'Titillium Web', -apple-system, BlinkMacSystemFont, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.05))",
              border: "1px solid rgba(220,38,38,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            ⚠
          </div>

          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#DC2626",
              margin: "0 0 0.75rem",
              textShadow: "0 0 30px rgba(220,38,38,0.3)",
            }}
          >
            Erreur critique
          </h2>

          <p
            style={{
              color: "#737373",
              fontSize: "0.875rem",
              margin: "0 0 2rem",
              maxWidth: 400,
            }}
          >
            Une erreur inattendue s&#39;est produite. L&#39;application n&#39;a
            pas pu se charger correctement.
          </p>

          <button
            onClick={() => reset()}
            style={{
              background:
                "linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.1))",
              border: "1px solid rgba(220,38,38,0.4)",
              color: "#DC2626",
              padding: "0.625rem 1.75rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "0.375rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(220,38,38,0.15))";
              e.currentTarget.style.borderColor = "rgba(220,38,38,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.1))";
              e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)";
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
