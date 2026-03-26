import { Mafs, Coordinates } from "mafs";
import { useState, useEffect } from "react";
export function CartesianPlan() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full w-full justify-center items-center flex vignette">
      <Mafs width={size.width} height={size.height}>
        <Coordinates.Cartesian subdivisions={3} />
      </Mafs>
    </div>
  );
}
