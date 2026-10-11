import React, { useState, useEffect } from "react";
import { X, Delete, Calculator as CalcIcon } from "lucide-react";

/**
 * Safe Math Evaluator (No eval!)
 * Uses Shunting-Yard Algorithm to parse and evaluate mathematical expressions safely.
 */
function safeEvaluate(expression) {
  if (!expression || typeof expression !== "string") return "0";

  // Normalize expression
  const sanitized = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .trim();

  if (!sanitized) return "0";

  // Tokenize
  const tokens = [];
  let i = 0;
  while (i < sanitized.length) {
    const char = sanitized[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = "";
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        numStr += sanitized[i];
        i++;
      }
      tokens.push({ type: "number", value: parseFloat(numStr) });
      continue;
    }

    if (["+", "-", "*", "/", "(", ")", "%"].includes(char)) {
      // Check for unary minus (e.g. at start or after operator/paren)
      if (char === "-") {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === "operator" || prev.value === "(") {
          // Unary minus: treat next number as negative
          i++;
          let numStr = "-";
          while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
            numStr += sanitized[i];
            i++;
          }
          tokens.push({ type: "number", value: parseFloat(numStr) });
          continue;
        }
      }

      tokens.push({ type: char === "(" || char === ")" ? "paren" : "operator", value: char });
      i++;
      continue;
    }

    // Invalid character
    throw new Error("Invalid character: " + char);
  }

  // Shunting-Yard to Postfix (RPN)
  const outputQueue = [];
  const opStack = [];

  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };

  for (const token of tokens) {
    if (token.type === "number") {
      outputQueue.push(token);
    } else if (token.type === "operator") {
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1].value !== "(" &&
        precedence[opStack[opStack.length - 1].value] >= precedence[token.value]
      ) {
        outputQueue.push(opStack.pop());
      }
      opStack.push(token);
    } else if (token.value === "(") {
      opStack.push(token);
    } else if (token.value === ")") {
      while (opStack.length > 0 && opStack[opStack.length - 1].value !== "(") {
        outputQueue.push(opStack.pop());
      }
      opStack.pop(); // remove '('
    }
  }

  while (opStack.length > 0) {
    outputQueue.push(opStack.pop());
  }

  // Evaluate RPN
  const evalStack = [];
  for (const token of outputQueue) {
    if (token.type === "number") {
      evalStack.push(token.value);
    } else if (token.type === "operator") {
      const b = evalStack.pop();
      const a = evalStack.pop();
      if (a === undefined || b === undefined) throw new Error("Malformed expression");

      let res = 0;
      switch (token.value) {
        case "+": res = a + b; break;
        case "-": res = a - b; break;
        case "*": res = a * b; break;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          res = a / b;
          break;
        case "%": res = a % b; break;
        default: throw new Error("Unknown operator");
      }
      evalStack.push(res);
    }
  }

  if (evalStack.length !== 1 || isNaN(evalStack[0])) {
    throw new Error("Evaluation error");
  }

  // Format result
  const final = evalStack[0];
  return Number.isInteger(final) ? String(final) : String(parseFloat(final.toFixed(8)));
}

export default function ExamCalculator({ isOpen, onClose }) {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (/[0-9]/.test(e.key)) {
        handleDigit(e.key);
      } else if (["+", "-", "*", "/", "%"].includes(e.key)) {
        handleOperator(e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key);
      } else if (e.key === "." || e.key === ",") {
        handleDecimal();
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key.toLowerCase() === "c") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, display, equation, isCalculated]);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (isCalculated) {
      setDisplay(digit);
      setEquation("");
      setIsCalculated(false);
    } else {
      setDisplay((prev) => (prev === "0" ? digit : prev + digit));
    }
  };

  const handleDecimal = () => {
    if (isCalculated) {
      setDisplay("0.");
      setEquation("");
      setIsCalculated(false);
    } else if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  };

  const handleOperator = (op) => {
    setIsCalculated(false);
    setEquation((prev) => `${prev} ${display} ${op}`);
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsCalculated(false);
  };

  const handleBackspace = () => {
    if (isCalculated) {
      handleClear();
    } else {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    }
  };

  const handleEquals = () => {
    try {
      const fullExpr = `${equation} ${display}`;
      const result = safeEvaluate(fullExpr);
      setEquation(fullExpr + " =");
      setDisplay(result);
      setIsCalculated(true);
    } catch (err) {
      setDisplay("Error");
      setIsCalculated(true);
    }
  };

  const handleSqrt = () => {
    try {
      const val = parseFloat(display);
      if (val < 0) throw new Error("Negative root");
      const res = Math.sqrt(val);
      setDisplay(Number.isInteger(res) ? String(res) : String(parseFloat(res.toFixed(8))));
      setIsCalculated(true);
    } catch {
      setDisplay("Error");
      setIsCalculated(true);
    }
  };

  const handleToggleSign = () => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") return prev;
      return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
    });
  };

  const buttonLayout = [
    [
      { label: "C", action: handleClear, className: "bg-[#FEF2F2] text-[#DC2626] font-bold" },
      { label: "±", action: handleToggleSign, className: "bg-[#F1F5F9] text-[#111C3A] font-bold" },
      { label: "√", action: handleSqrt, className: "bg-[#F1F5F9] text-[#111C3A] font-bold" },
      { label: "÷", action: () => handleOperator("÷"), className: "bg-[#EFF6FF] text-[#0B63F6] font-bold" }
    ],
    [
      { label: "7", action: () => handleDigit("7") },
      { label: "8", action: () => handleDigit("8") },
      { label: "9", action: () => handleDigit("9") },
      { label: "×", action: () => handleOperator("×"), className: "bg-[#EFF6FF] text-[#0B63F6] font-bold" }
    ],
    [
      { label: "4", action: () => handleDigit("4") },
      { label: "5", action: () => handleDigit("5") },
      { label: "6", action: () => handleDigit("6") },
      { label: "−", action: () => handleOperator("−"), className: "bg-[#EFF6FF] text-[#0B63F6] font-bold" }
    ],
    [
      { label: "1", action: () => handleDigit("1") },
      { label: "2", action: () => handleDigit("2") },
      { label: "3", action: () => handleDigit("3") },
      { label: "+", action: () => handleOperator("+"), className: "bg-[#EFF6FF] text-[#0B63F6] font-bold" }
    ],
    [
      { label: "0", action: () => handleDigit("0") },
      { label: ".", action: handleDecimal },
      { label: "⌫", action: handleBackspace, className: "bg-[#F1F5F9] text-[#52627F]" },
      { label: "=", action: handleEquals, className: "bg-[#0B63F6] text-white font-black" }
    ]
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div
        className="w-full max-w-xs bg-white rounded-2xl border border-[#DCE5F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-label="On-Screen Examination Calculator"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111C3A]">
            <CalcIcon className="w-4 h-4 text-[#0B63F6]" />
            <span>Candidate Calculator</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-[#111C3A] text-right text-white">
          <div className="h-4 text-[11px] text-[#94A3B8] font-mono truncate">
            {equation}
          </div>
          <div className="text-2xl font-black font-mono tracking-wider truncate mt-1">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-3 grid grid-cols-4 gap-2 bg-[#F8FAFC]">
          {buttonLayout.flat().map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              className={`h-11 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-2xs flex items-center justify-center cursor-pointer select-none ${
                btn.className || "bg-white text-[#111827] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
