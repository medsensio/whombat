import { useState, useEffect } from "react";

export default function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false); useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}
