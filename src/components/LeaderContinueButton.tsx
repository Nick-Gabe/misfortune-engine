import { Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type LeaderButtonProps = {
  onClick: () => void;
  userIsLeader: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

export const LeaderButton = ({
  disabled,
  userIsLeader,
  onClick,
  children = null,
}: LeaderButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center">
      <Button
        variant="contained"
        disabled={disabled || !userIsLeader}
        onClick={() => {
          if (!userIsLeader) return;
          onClick();
        }}
      >
        {children ?? t("common.continue")}
      </Button>
      {!userIsLeader && !disabled && (
        <Typography
          variant="body1"
          fontSize={12}
          className="animate-pulse"
          color="primary"
        >
          {t("common.waitingRoomLeader")}
        </Typography>
      )}
    </div>
  );
};
