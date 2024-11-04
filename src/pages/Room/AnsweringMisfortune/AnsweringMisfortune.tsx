import { Button, TextField, Typography } from "@mui/material";
import { RoomScreenProps } from "../Room";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Lock } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export const AnsweringMisfortune = ({
  room,
  publish,
  user,
}: RoomScreenProps) => {
  const { t } = useTranslation();
  const [announcedMisfortune, setAnnouncedMisfortune] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  const timeToAnimateAnnouncement =
    (room?.currentMisfortune?.announcement.length ?? 50) * 0.1 + 1;
  const timeToAnimateMisfortune = 2;
  const timeToReadMisfortune = 3;

  const maxAnswerLength = 150;

  useEffect(() => {
    if (!announcedMisfortune) {
      setTimeout(() => {
        setAnnouncedMisfortune(true);
      }, (timeToAnimateAnnouncement + timeToAnimateMisfortune + timeToReadMisfortune) * 1000);
    }
  }, []);

  const sendAnswer = () => {
    const userIndex = room?.players.findIndex((p) => p.id === user.id);
    setAnswered(true);
    setTimeout(() => {
      publish("room:answer", {
        ...user,
        answer,
      });
      // In order for events to not conflict, we ensure each is sent at a different time
    }, (userIndex ?? Math.random() * 3) * 1000);
  };

  return (
    <div className="flex flex-col px-6 md:px-0 md:overflow-hidden justify-center items-center gap-4">
      <CountdownCircleTimer
        isPlaying={announcedMisfortune}
        duration={60}
        colors={["#fff", "#fff", "#A30000"]}
        colorsTime={[60, 10, 0]}
        size={50}
        strokeWidth={4}
        onComplete={sendAnswer}
      >
        {({ remainingTime }) => (
          <span className="text-slate-50">{remainingTime}</span>
        )}
      </CountdownCircleTimer>
      <p className="flex whitespace-pre justify-center max-w-[90vw]">
        {announcedMisfortune ? (
          <motion.span
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            initial={{
              opacity: 0,
              translateY: 50,
            }}
            transition={{
              bounce: 400,
            }}
          >
            <Typography
              variant="body1"
              color="white"
              fontSize={25}
              fontWeight="semibold"
              variantMapping={{
                body1: "span",
              }}
            >
              {t("pages.answeringMisfortune.howWouldYouSurvive")}
            </Typography>
          </motion.span>
        ) : (
          room?.currentMisfortune?.announcement.split("").map((char, index) => (
            <motion.span
              key={char + index}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              initial={{
                opacity: 0,
                translateY: 50,
              }}
              transition={{
                bounce: 400,
                delay: index * 0.1 + 1,
              }}
            >
              <Typography
                variant="body1"
                color="white"
                fontSize={25}
                fontWeight="semibold"
              >
                {char}
              </Typography>
            </motion.span>
          ))
        )}
      </p>
      <motion.div
        className="flex items-center justify-center max-w-[50ch]"
        animate={{ opacity: 1, translateY: 0 }}
        initial={{ opacity: 0, translateY: 50 }}
        transition={{
          duration: 0.5,
          bounce: 40,
          delay: timeToAnimateAnnouncement + timeToAnimateMisfortune,
        }}
      >
        <Typography
          variant="body1"
          color="primary"
          textAlign="center"
          fontSize={20}
        >
          {room?.currentMisfortune?.content}
        </Typography>
      </motion.div>
      {announcedMisfortune && (
        <motion.div
          className="relative w-full mt-10 flex flex-col items-center"
          animate={{ opacity: 1, height: "auto" }}
          initial={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.5,
            bounce: 40,
            delay: 1,
          }}
        >
          <TextField
            className="!bg-slate-700 [&>div]:!text-slate-50 [&_textarea]:fill-yellow-500 rounded-t-xl [&_textarea]:!h-[35vh] [&_textarea]:!text-xl"
            variant="filled"
            fullWidth
            multiline
            value={answer}
            onChange={(e) =>
              e.target.value.length <= maxAnswerLength &&
              setAnswer(e.target.value)
            }
            placeholder={t("pages.answeringMisfortune.answerPlaceholder")}
            color="primary"
            disabled={answered}
          />
          {answered && (
            <div>
              <Lock htmlColor="white" />
            </div>
          )}
          <Typography
            variant="body1"
            color="gray"
            fontWeight="bold"
            alignSelf="end"
            visibility={!answered ? "visible" : "hidden"}
          >
            {answer.length}/{maxAnswerLength}
          </Typography>
          <div className="h-9">
            {answered ? (
              <Typography variant="body1" color="white">
                {t("pages.answeringMisfortune.answerSubmitted")}
              </Typography>
            ) : (
              <Button
                variant="text"
                color="primary"
                onClick={sendAnswer}
                disabled={answered}
              >
                {t("common.submit")}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
