import { useEffect, useMemo, useState } from "react";
import { RoomScreenProps } from "../Room";
import { motion } from "framer-motion";
import { Button, Typography } from "@mui/material";
import { useAiMutation } from "../../../shared/useAi";
import { TextSpinner } from "../../../components/TextSpinner/TextSpinner";
import { Confetti, CrownSimple, Skull } from "@phosphor-icons/react";
import { AnimatedBackground } from "animated-backgrounds";

export const OutcomeShowcase = ({ room, user, publish }: RoomScreenProps) => {
  const { mutateAsync } = useAiMutation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialPlayers = useMemo(() => room?.players, []);
  const [finishedCurrentShowcase, setFinishedCurrentShowcase] = useState(false);
  const userBeingShowcased = useMemo(
    () => room?.currentShowcase?.user ?? room?.players[0],
    [room?.currentShowcase?.user]
  );

  useEffect(() => {
    const fetchOutcome = async () => {
      if (!userBeingShowcased) return;

      const data = await mutateAsync([
        {
          role: "system",
          content: `You're in a game where you decide misfortunes that happen to players and WILL kill them. Their objective is to survive them. You say the misfortune and the user will say what they made to survive. After the user replies with their survival strategy, return a JSON containing how the story continued from the start, mentioning the user decision on it and saying if they survived or not at the end. It should include no more than 250 characters, try to divide it in a few sentences with periods. Also include how many points the user got from their approach, being 0 the worst, where they didn't survive at all, and 10 the best, where they survived without any harm and in a creative way. The JSON you must return should follow this structure: { points: number, content: string }`,
        },
        {
          role: "user",
          content: "Generate a misfortune",
        },
        {
          role: "assistant",
          content: '"The floor suddenly turns into quicksand"',
        },
        {
          role: "user",
          content:
            "My name is Nico. To survive I would jump frenetically, trying to escape.",
        },
        {
          role: "assistant",
          content:
            '{"points": 5, "content": "Nico was walking quietly when out of nowhere the floor turned into quicksand. Nico had a fright, and their first instinct was to jump frenetically, thinking it could help. However, the quicksand was too deep, and they ended up sinking. Nico didn\'t survive."}',
        },
        {
          role: "user",
          content: "Generate a misfortune",
        },
        {
          role: "assistant",
          content: room?.currentMisfortune?.content ?? "",
        },
        {
          role: "user",
          content: `My name is ${userBeingShowcased.name || "player"}. ${
            userBeingShowcased.answer || "I did nothing to survive"
          }.`,
        },
      ]);

      const json = JSON.parse(data.choices[0].message.content);
      const userBeingShowcasedWithPoints: User = {
        ...userBeingShowcased,
        points: json.points,
        pointsHistory: [...userBeingShowcased.pointsHistory, json.points],
      };

      setTimeout(() => {
        publish("room:state", {
          ...room,
          players: room?.players.map((p) =>
            p.id === userBeingShowcased?.id ? userBeingShowcasedWithPoints : p
          ),
          currentShowcase: {
            user: userBeingShowcasedWithPoints,
            outcome: {
              points: json.points,
              content: json.content,
            },
          },
        });
      }, 4500);
    };

    if (
      user.id === room?.players[0].id &&
      userBeingShowcased &&
      room.currentShowcase?.outcome === null
    ) {
      fetchOutcome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBeingShowcased]);

  const goToNextShowcase = () => {
    setFinishedCurrentShowcase(false);
    const currentPlayerIndex = initialPlayers?.findIndex(
      (p) => p.id === userBeingShowcased?.id
    );
    if (currentPlayerIndex !== undefined && currentPlayerIndex !== -1) {
      const nextPlayer = initialPlayers?.[currentPlayerIndex + 1];
      if (nextPlayer) {
        publish("room:state", {
          ...room,
          currentShowcase: {
            user: nextPlayer,
            outcome: null,
          },
        });
      } else {
        publish("room:state", {
          ...room,
          screen: "leaderboard",
          currentMisfortune: null,
          currentShowcase: null,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <AnimatedBackground
        animationName="auroraBorealis"
        style={{
          opacity: 0.2,
        }}
      />
      {!room?.currentShowcase?.outcome ? (
        <>
          <div className="fixed z-[10]">
            <motion.div
              animate={{ opacity: 1, translateY: 0 }}
              initial={{ opacity: 0, translateY: 50 }}
              transition={{
                duration: 0.5,
                bounce: 40,
                delay: 1,
              }}
            >
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                fontSize={20}
              >
                All choices were made...
              </Typography>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, translateY: 0 }}
              initial={{ opacity: 0, translateY: 50 }}
              transition={{
                duration: 0.5,
                bounce: 40,
                delay: 3,
              }}
            >
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                fontSize={20}
              >
                Now witness the consequences
              </Typography>
            </motion.div>
          </div>
          <motion.div
            key="loading-spinner2"
            className="spinner spinner-2 fixed"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          >
            <TextSpinner
              text="LOADING LOADING LOADING LOADING"
              radius={110}
              fontSize={18}
              letterSpacing={11}
            />
          </motion.div>
        </>
      ) : (
        <>
          <Typography
            className="!mb-3"
            variant="h2"
            color="primary"
            textAlign="center"
            fontSize={25}
          >
            The misfortune was:
          </Typography>
          <Typography
            className="!mb-6 max-w-[45ch]"
            variant="body1"
            textAlign="center"
            color="textPrimary"
            fontSize={20}
          >
            {room?.currentMisfortune?.content}
          </Typography>
          <motion.div
            className="bg-slate-600 border-2 p-4 max-w-[600px] w-[80vw] rounded-lg flex flex-col relative"
            key="modal"
            animate={{ opacity: 1, translateY: 0 }}
            initial={{ opacity: 0, translateY: 50 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="mt-6"
            >
              <Typography
                variant="body1"
                color="primary"
                fontWeight="bold"
                fontSize={25}
              >
                {userBeingShowcased?.name} tried...
              </Typography>
              <Typography variant="body1" color="textPrimary" fontSize={20}>
                {userBeingShowcased?.answer}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 5 }}
              className="mt-6"
            >
              <Typography
                variant="body1"
                color="primary"
                fontWeight="bold"
                fontSize={25}
              >
                And the outcome was...
              </Typography>
              <p className="inline-block mb-5">
                {room?.currentShowcase?.outcome.content
                  .split(". ")
                  .map((sentence, i, src) => {
                    const isLastSentence = src.length - 1 === i;
                    return (
                      <>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 8 + i * 2 }}
                          onAnimationComplete={
                            isLastSentence
                              ? () => setFinishedCurrentShowcase(true)
                              : undefined
                          }
                        >
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            variantMapping={{
                              body1: "span",
                            }}
                            fontSize={18}
                          >
                            {sentence}
                            {sentence.endsWith(".") ? "" : ". "}
                          </Typography>
                        </motion.span>
                      </>
                    );
                  })}
              </p>
            </motion.div>
            <div className="self-end flex gap-4">
              {finishedCurrentShowcase && (
                <motion.div
                  className="absolute right-5 top-5"
                  initial={{ opacity: 0, scale: 10 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [10, -10, 10],
                      opacity: [1, 1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  >
                    {!userBeingShowcased?.points ? (
                      <Skull weight="duotone" size={62} />
                    ) : userBeingShowcased?.points > 7 ? (
                      <Confetti weight="duotone" size={62} />
                    ) : (
                      <CrownSimple weight="duotone" size={62} />
                    )}
                  </motion.div>
                </motion.div>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={goToNextShowcase}
                disabled={
                  user.id !== room?.players[0].id || !finishedCurrentShowcase
                }
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
