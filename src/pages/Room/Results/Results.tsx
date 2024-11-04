import { RoomScreenProps } from "../Room";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedBackground } from "animated-backgrounds";
import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { CrownSimple } from "@phosphor-icons/react";
import { LeaderButton } from "../../../components/LeaderContinueButton";
import { useTranslation } from "react-i18next";

export const Results = ({ room, publish, userIsLeader }: RoomScreenProps) => {
  const { t } = useTranslation();
  const [animationStep, setAnimationStep] = useState(0);
  const initialPlayers = useMemo(() => room?.players, []);
  const winnerPlayer = initialPlayers?.reduce((prev, current) =>
    prev.points > current.points ? prev : current
  );

  const goBackToRoom = () => {
    publish("room:state", {
      ...room,
      screen: "waitingRoom",
    });
  };

  return (
    <div className="flex flex-col w-full overflow-hidden h-90-dvh md:h-full justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
      >
        <AnimatedBackground
          animationName="electricStorm"
          style={{
            opacity: 0.2,
          }}
        />
      </motion.div>
      <div className="fixed flex flex-col items-center justify-center">
        <AnimatePresence>
          {animationStep < 1 && (
            <>
              <motion.div
                key="after-all-the-challenges"
                initial={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography
                  variant="h1"
                  color="primary"
                  textAlign="center"
                  fontSize={35}
                >
                  {t("pages.results.afterAllChallenges")}
                </Typography>
              </motion.div>
              <motion.div
                key="one-person-emerged-victorious"
                initial={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <Typography
                  variant="h1"
                  color="primary"
                  textAlign="center"
                  fontSize={35}
                >
                  {t("pages.results.onePersonEmerged")}
                </Typography>
              </motion.div>
              <motion.div
                key="the-outcome-was"
                initial={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, delay: 3 }}
                onAnimationComplete={() => setAnimationStep(1)}
              >
                <Typography
                  variant="h1"
                  color="primary"
                  textAlign="center"
                  fontSize={35}
                >
                  {t("pages.results.andItWas")}
                </Typography>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="bg-yellow-50 flex flex-col justify-center items-center rounded-full shadow-white shadow-yellow-50 relative"
        initial={{
          opacity: 0,
          width: 0,
          height: 0,
          boxShadow: "0 0 0 0 rgba(255, 255, 255, 1)",
        }}
        animate={{
          opacity: 1,
          width: animationStep < 2 ? "50vh" : 300,
          height: animationStep < 2 ? "50vh" : 300,
          border:
            animationStep < 2 ? "0px solid transparent" : "8px solid #FFD700",
          boxShadow:
            animationStep < 2
              ? "0 0 50px 50px rgba(255, 255, 255, 1)"
              : "0 0 0px 0px rgba(255, 255, 255, 1)",
        }}
        transition={{
          duration: animationStep < 2 ? 5 : 2,
          delay: animationStep < 2 ? 6 : 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 720 }}
          transition={{ delay: 12, duration: 2 }}
          onAnimationComplete={() => setAnimationStep(2)}
          className="max-w-full px-4"
        >
          <Typography
            variant="h1"
            color="primary"
            fontSize={30}
            fontWeight="bold"
            className="w-full truncate"
          >
            {winnerPlayer?.name}
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 15 }}
        >
          <Typography
            variant="body1"
            color="black"
            fontSize={20}
            fontWeight="bold"
          >
            {t("pages.results.withPoints", {
              value: winnerPlayer?.points,
            })}
          </Typography>
        </motion.div>
        <motion.div
          initial={{
            scale: 1.3,
            opacity: 0,
            left: -40,
            top: -40,
            rotate: -45,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            left: -20,
            top: -20,
            rotate: -45,
          }}
          transition={{
            delay: 16,
          }}
          className="absolute z-10"
          onAnimationComplete={() => setAnimationStep(3)}
        >
          <CrownSimple
            size={80}
            weight="fill"
            className={"text-yellow-400"}
            stroke="black"
            strokeWidth={20}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="overflow-hidden mb-4"
        animate={{
          height: "auto",
          marginTop: 24,
        }}
        initial={{
          height: 0,
          marginTop: 0,
          transformOrigin: "bottom",
        }}
        transition={{
          delay: 18,
        }}
        onAnimationComplete={() => setAnimationStep(4)}
      >
        <Typography
          variant="h1"
          color="primary"
          fontSize={35}
          className="mt-10"
          fontFamily="Handjet, monospace"
          fontWeight={700}
          textAlign="center"
          letterSpacing={3}
        >
          {t("pages.results.isTheMisfortuneMaster")}
        </Typography>
      </motion.div>
      {animationStep === 4 && (
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LeaderButton userIsLeader={userIsLeader} onClick={goBackToRoom} />
        </motion.div>
      )}
    </div>
  );
};
