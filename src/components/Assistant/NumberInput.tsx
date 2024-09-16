import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      setError("Please enter a valid number");
    } else if (newValue < min || newValue > max) {
      setError(`Value must be between ${min} and ${max}`);
    } else {
      setError(null);
      onChange(newValue);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setInputValue(newValue.toString());
    setError(null);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="w-full"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default NumberInput;