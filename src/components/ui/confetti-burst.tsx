"use client";

import * as React from "react";
import Confetti from "react-confetti";

/**
 * Ráfaga única de confeti a pantalla completa. Se monta, dispara una vez
 * (recycle=false) y se desmonta sola al terminar. Para relanzarla, cambia su
 * `key` en el padre (remonta el componente).
 */
export function ConfettiBurst() {
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const medir = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  if (done || !size.w) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <Confetti
        width={size.w}
        height={size.h}
        numberOfPieces={320}
        recycle={false}
        gravity={0.25}
        tweenDuration={6000}
        onConfettiComplete={() => setDone(true)}
      />
    </div>
  );
}
