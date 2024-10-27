import { motion } from "framer-motion";
import "./styles.css";

export const TextSpinner = ({
  text,
  radius,
  fontSize,
  letterSpacing,
}: {
  text: string;
  radius: number;
  fontSize: number;
  letterSpacing: number;
}) => {
  const characters = text.split("");

  return (
    <motion.div className="circle" style={{ width: radius * 2 }}>
      <p aria-label={text} />
      <p aria-hidden="true" className="text">
        {characters.map((ch, i) => (
          <motion.span
            key={i}
            className={`letter letter-${i}`}
            style={{
              transformOrigin: `0 ${radius}px`,
              transform: `rotate(${i * letterSpacing}deg)`,
              fontSize,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
};
