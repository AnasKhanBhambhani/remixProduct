import { useEffect, useState } from "react";

const UseDebounce = (value: string) => {
  const [bouncedValue, setBouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setBouncedValue(value);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);
  return bouncedValue;
};
export default UseDebounce;
