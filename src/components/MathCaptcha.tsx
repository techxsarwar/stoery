import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface MathCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function MathCaptcha({ onValidate }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    onValidate(false);
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background - slight noise
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.2 + 0.1})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add some noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text configuration
    ctx.font = "bold 24px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const text = `${num1} + ${num2} =`;
    
    // Slight rotation and distortion
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((Math.random() - 0.5) * 0.1);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    setIsClient(true);
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (isClient && num1 !== 0) {
      drawCaptcha();
    }
  }, [num1, num2, isClient]);

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
        <div className="bg-white border-4 border-on-surface flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center">
          <canvas 
            ref={canvasRef} 
            width={120} 
            height={44} 
            className="block"
          />
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
