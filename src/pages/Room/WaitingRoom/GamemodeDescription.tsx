import { Typography } from "@mui/material";
import { Crown } from "@phosphor-icons/react";
import { Trans, useTranslation } from "react-i18next";

type GamemodeDescriptionProps = {
  gamemode: "coop" | "versus";
};

export const GamemodeDescription = (props: GamemodeDescriptionProps) => {
  const { t } = useTranslation();
  const gamemodeInfo = {
    coop: {
      title: t("pages.room.modes.coop.title"),
      description: t("pages.room.modes.coop.description"),
    },
    versus: {
      title: t("pages.room.modes.versus.title"),
      description: t("pages.room.modes.versus.description"),
    },
  };

  return (
    <div className="flex flex-col gap-3">
      <Typography variant="h3" fontWeight="bold" color="primary">
        {gamemodeInfo[props.gamemode].title}
      </Typography>
      <Typography
        variant="body1"
        whiteSpace="pre-line"
        maxWidth="50ch"
        color="textPrimary"
      >
        {gamemodeInfo[props.gamemode].description}
      </Typography>
      <Typography variant="body1" maxWidth="50ch" color="primary">
        <Trans i18nKey="pages.room.leaderExplanation">
          <Crown
            weight="fill"
            size={20}
            className="text-yellow-400 inline-block"
            stroke="black"
            strokeWidth={10}
          />
        </Trans>
      </Typography>
    </div>
  );
};
