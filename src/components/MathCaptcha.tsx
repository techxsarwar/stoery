"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface MathCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function MathCaptcha({ onValidate }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isClient, setIsClient] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    onValidate(false);
  };

  useEffect(() => {
    setIsClient(true);
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);
    if (parseInt(val) === num1 + num2) {
      onValidate(true);
    } else {
      onValidate(false);
    }
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-headline font-black uppercase text-on-surface tracking-tighter text-xs">
        Human Verification
      </label>
      <div className="flex items-stretch gap-2 w-full">
        <div className="flex items-center justify-center bg-surface-container-high border-4 border-on-surface text-on-surface font-headline font-black text-lg px-4 flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {num1} + {num2} =
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={handleChange}
          required
          placeholder="?"
          className="flex-grow border-4 border-on-surface px-4 py-2 font-body font-bold text-lg focus:outline-none focus:bg-primary-container transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface text-on-surface placeholder:text-on-surface-variant/50 uppercase max-w-[80px]"
        />
        <button
          type="button"
          onClick={generateCaptcha}
          className="flex items-center justify-center bg-on-surface text-surface border-4 border-on-surface px-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all flex-shrink-0"
          title="Refresh Captcha"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
}
