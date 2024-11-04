import { Typography } from "@mui/material";
import { RoomScreenProps } from "../Room";
import { motion } from "framer-motion";
import {
  Confetti,
  Crown,
  CrownSimple,
  Dot,
  Skull,
} from "@phosphor-icons/react";
import { useState } from "react";
import { LeaderButton } from "../../../components/LeaderContinueButton";
import { useTranslation } from "react-i18next";

const quantityOfMatches = 5;

export const Leaderboard = ({
  room,
  user,
  userIsLeader,
  publish,
}: RoomScreenProps) => {
  const { t } = useTranslation();
  const [finishedShowingLeaderboard, setFinishedShowingLeaderboard] =
    useState(false);

  const continueGame = () => {
    if (!room) {
      return;
    }

    const newRoom: Room = {
      ...room,
      players: room.players.map((player) => ({
        ...player,
        answer: null,
      })),
      currentMisfortune: null,
      currentShowcase: undefined,
    };

    if (
      room.players.some(
        (player) => player.pointsHistory.length >= quantityOfMatches
      )
    ) {
      publish("room:state", {
        ...newRoom,
        screen: "results",
      });
      return;
    }
    publish("room:state", {
      ...newRoom,
      screen: "decidingMisfortune",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Typography
        variant="h1"
        color="primary"
        fontFamily="Handjet, monospace"
        fontWeight={700}
        letterSpacing={5}
        paddingX={10}
      >
        {t("common.leaderboard")}
      </Typography>
      <div className="flex flex-col gap-4 w-[90vw] max-w-[600px]">
        {[...(room?.players ?? [])]
          .sort((a, b) => b.points - a.points)
          .map((player, playerIndex, src) => {
            const playerIsLeader = room?.players[0].id === player.id;
            return (
              <div className="relative w-full">
                {playerIndex < 3 && (
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
                      delay: 1 + playerIndex,
                    }}
                    className="absolute z-10"
                  >
                    <CrownSimple
                      size={40}
                      weight="fill"
                      className={
                        playerIndex === 0
                          ? "text-yellow-400"
                          : playerIndex === 1
                          ? "text-black-400"
                          : "text-yellow-900"
                      }
                      stroke="black"
                      strokeWidth={20}
                    />
                  </motion.div>
                )}
                <motion.div
                  key={player.id}
                  className={`${
                    user?.id === player.id ? "bg-slate-400" : "bg-slate-500"
                  } flex items-center gap-2 rounded-lg relative overflow-hidden`}
                  initial={{ height: 0, padding: 0 }}
                  animate={{ height: 56, padding: 16 }}
                  transition={{
                    duration: 0.2,
                    delay: playerIndex,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    className="flex gap-2"
                  >
                    {playerIsLeader && (
                      <Crown
                        weight="fill"
                        size={20}
                        className="text-yellow-400"
                        stroke="black"
                        strokeWidth={10}
                      />
                    )}
                    {player.name}
                  </Typography>

                  <div className="absolute flex mr-2 right-[50px] gap-2 h-full items-center">
                    {Array.from(
                      { length: quantityOfMatches },
                      (_, pointIndex) => {
                        const point = player.pointsHistory.at(pointIndex);
                        return (
                          <motion.div
                            animate={{ scale: 1, opacity: 1 }}
                            initial={{ scale: 1.5, opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              delay: playerIndex + pointIndex * 0.2,
                            }}
                            className="flex flex-col"
                          >
                            {point === undefined ? (
                              <Dot weight="duotone" size={30} />
                            ) : point === 0 ? (
                              <Skull weight="duotone" size={30} />
                            ) : point > 7 ? (
                              <Confetti weight="duotone" size={30} />
                            ) : (
                              <CrownSimple weight="duotone" size={30} />
                            )}
                            {point !== undefined && (
                              <Typography
                                variant="body1"
                                textAlign="center"
                                fontSize={10}
                                fontWeight="bold"
                              >
                                {point}
                              </Typography>
                            )}
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 50 }}
                    className="border-l-2 border-slate-800 absolute right-0 h-full grid place-items-center bg-slate-400 rounded-r-lg"
                    transition={{
                      delay:
                        player.pointsHistory.length * 0.2 + playerIndex + 0.3,
                    }}
                    onAnimationComplete={() => {
                      if (playerIndex === src.length - 1) {
                        setFinishedShowingLeaderboard(true);
                      }
                    }}
                  >
                    <Typography variant="body1">{player.points}</Typography>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
      </div>
      <LeaderButton
        onClick={continueGame}
        disabled={!finishedShowingLeaderboard}
        userIsLeader={userIsLeader}
      />
    </div>
  );
};
