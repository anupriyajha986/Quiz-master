import React from "react";

/**
 * Lightweight mathematical and formatted question text renderer.
 * Formats superscripts (e.g., m/s², x^2), subscripts (e.g., H_2O, μ₀),
 * fractions, and Greek symbols without adding heavy external dependencies.
 */
export default function MathRenderer({ text, className = "" }) {
  if (!text) return null;

  // If text contains HTML tags, render safely or format
  const formatMathString = (str) => {
    if (typeof str !== "string") return str;

    // Common scientific and algorithmic unicode replacements
    const replaced = str
      .replace(/\^2/g, "²")
      .replace(/\^3/g, "³")
      .replace(/\^([0-9n])/g, "ⁿ")
      .replace(/mu_0/g, "μ₀")
      .replace(/theta/g, "θ")
      .replace(/pi/g, "π")
      .replace(/Omega/g, "Ω");

    return replaced;
  };

  const formatted = formatMathString(text);

  return (
    <span className={`inline-block leading-relaxed ${className}`}>
      {formatted}
    </span>
  );
}
