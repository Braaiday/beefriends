import { useEffect, useState } from "react";

type Flower = {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
};

type Bee = {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  animationDuration: number;
};

export const GardenBackground = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [bees, setBees] = useState<Bee[]>([]);

  useEffect(() => {
    generateFlowers();
    generateBees();

    const handleResize = () => {
      generateFlowers();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateFlowers = () => {
    const numberOfFlowers = Math.floor((window.innerWidth * window.innerHeight) / 150000);
    const newFlowers: Flower[] = [];

    for (let i = 0; i < numberOfFlowers; i++) {
      newFlowers.push({
        id: i,
        size: Math.random() * 40 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    setFlowers(newFlowers);
  };

  const generateBees = () => {
    const numberOfBees = 5;
    const newBees: Bee[] = [];

    for (let i = 0; i < numberOfBees; i++) {
      newBees.push({
        id: i,
        size: Math.random() * 40 + 20,
        x: Math.random() * 10 - 10,
        y: Math.random() * 50,
        delay: Math.random() * 10,
        animationDuration: Math.random() * 15 + 15,

      });
    }

    setBees(newBees);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <>
        {/* Flowers */}
        {flowers.map((flower) => (
          <img
            key={flower.id}
            src="/images/sunflower.png"
            alt="Flower"
            className="flower animate-pulse-subtle"
            style={{
              width: `${flower.size}px`,
              height: `${flower.size}px`,
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              opacity: flower.opacity,
            }}
          />
        ))}

        {/* Bees */}
        {bees.map((bee) => (
          <div
            key={bee.id}
            className="bee animate-bees"
            style={{
              width: `${bee.size}px`,
              height: `${bee.size}px`,
              left: `${bee.x}%`,
              top: `${bee.y}%`,
              animationDelay: `${bee.delay}s`,
              animationDuration: `${bee.animationDuration}s`,
              animationFillMode: "backwards",
              position: "absolute",
            }}
          >
            <img
              src="/gifs/bee_flying.gif"
              alt="Bee"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </>
    </div>
  );
};
