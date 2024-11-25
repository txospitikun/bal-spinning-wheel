import React, { useState } from "react";
import "../css/FortuneWheel.css";
import Modal from "../components/Modal";

const FortuneWheel = ({ data }) => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);

  // Calculate slices with proportional angles
  let angleStart = 0;

  const slices = data.map((item) => {
    const sliceAngle = (item.votes / totalVotes) * 360;
    const startAngle = angleStart;
    angleStart += sliceAngle;
    console.log(item.name)
    console.log(angleStart)
    return { ...item, sliceAngle, startAngle };
  });

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Randomize spin with 5-7 full rotations plus a random offset
    const randomSpins = Math.floor(Math.random() * 3) + 5;
    const randomOffset = Math.random() * 360;
    const targetRotation = randomSpins * 360 + randomOffset;

    console.log(targetRotation)

    const newRotation = currentRotation + targetRotation;

    // Calculate normalized angle in [0, 360)
    const normalizedAngle = ((newRotation % 360) + 360) % 360;

    // Find the winner slice
    const selectedSlice = slices.find(
      ({ startAngle, sliceAngle }) =>
        normalizedAngle >= startAngle &&
        normalizedAngle < startAngle + sliceAngle
    );

    setCurrentRotation(newRotation);
    setTimeout(() => {
      // let person = slices[selectedSlice.id + 2];
      setResult(selectedSlice);
      setIsSpinning(false);
      setOpenModal(true);
    }, 4500);
  };

  return (
    <section className="section-wheel">
      <div className="wheel-container">
        <div className="pointer"></div>
        <svg
          className="wheel"
          viewBox="0 0 200 200"
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: "transform 4.5s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {slices.map(({ name, startAngle, sliceAngle }, index) => {
            // Midpoint of the slice (center of the text)
            const middleAngle = startAngle + sliceAngle / 2;

            // Calculate position of the text on the circle (fixed radius of 85px)
            const textRadius = 85;
            const textX =
              100 + textRadius * Math.cos((middleAngle * Math.PI) / 180);
            const textY =
              100 - textRadius * Math.sin((middleAngle * Math.PI) / 180);

            // Calculate the angle for the line from the center of the wheel to the center of the text
            const angle =
              Math.atan2(textY - 100, textX - 100) * (180 / Math.PI); // Convert from radians to degrees

            // Text rotation angle should be the same as the calculated angle, to align it with the line
            const rotationAngle = angle + 90; // Adjust to make text perpendicular to the line

            // Path for slice (draw each slice)
            const x1 = 100 + 100 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 - 100 * Math.sin((startAngle * Math.PI) / 180);
            const x2 =
              100 + 100 * Math.cos(((startAngle + sliceAngle) * Math.PI) / 180);
            const y2 =
              100 - 100 * Math.sin(((startAngle + sliceAngle) * Math.PI) / 180);
            const largeArc = sliceAngle > 180 ? 1 : 0;

            return (
              <g key={index}>
                {/* Slice */}
                <path
                  d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 0 ${x2} ${y2} Z`}
                  fill={`hsl(${(index * 360) / slices.length}, 80%, 60%)`}
                />

                {/* Text */}
                <text
                  fill="white"
                  fontSize="4"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  x={textX}
                  y={textY}
                  transform={`rotate(${rotationAngle + 90} ${textX} ${textY})`}
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>

        <button
          className="spin-button"
          onClick={handleSpin}
          disabled={isSpinning}
        >
          Spin
        </button>
        {<Modal open={openModal} setOpen={setOpenModal} winner={result} />}
      </div>
    </section>
  );
};

export default FortuneWheel;
