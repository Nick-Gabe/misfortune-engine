import { useEffect } from "react";
import { RoomScreenProps } from "../Room";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { TextSpinner } from "../../../components/TextSpinner/TextSpinner";
import { useAiQuery } from "../../../shared/useAi";

const disasterAnnouncementPhrases = [
  "A shiver runs down your spine",
  "You feel a chill in the air",
  "The world around you darkens",
  "A disaster is about to strike",
  "You sense impending doom",
  "You feel a sense of dread",
];

export const DecidingMisfortune = ({
  room,
  publish,
  user,
}: RoomScreenProps) => {
  const { data } = useAiQuery({
    user,
    room,
    messages: [
      {
        role: "system",
        content: `You're in a game where you decide misfortunes that happen to players and WILL kill them. Their objective is to survive them. You should only include the text of the misfortune, not how they survive, options of how to behave on it, or any other information. The misfortune must be creative and short, under 100 characters. The answer must include a window for decision, remember someone will try to avoid it. If you refer to the player, refer to them as "you". Your answer CAN include topics from popular games, movies or series. ${Math.random()}`,
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
        content: "Generate a misfortune",
      },
    ],
  });

  useEffect(() => {
    if (data) {
      publish("room:state", {
        ...room,
        screen: "answeringMisfortune",
        currentMisfortune: {
          content: data.choices[0].message.content,
          announcement:
            disasterAnnouncementPhrases[
              Math.floor(Math.random() * disasterAnnouncementPhrases.length)
            ],
        },
      });
    }
  }, [data]);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="fixed z-10 bg-slate-800 py-4"
        animate={{ opacity: 1, translateY: 0 }}
        initial={{ opacity: 0, translateY: 50 }}
        transition={{
          duration: 0.5,
          bounce: 40,
        }}
      >
        <Typography variant="h4" color="primary">
          The game will start
        </Typography>
      </motion.div>
      <motion.div
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
    </div>
  );
};
