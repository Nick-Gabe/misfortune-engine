import { Button, Typography } from "@mui/material";
import { ReactNode } from "react";

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
  children = "Continue",
}: LeaderButtonProps) => {
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
        {children}
      </Button>
      {!userIsLeader && !disabled && (
        <Typography
          variant="body1"
          fontSize={12}
          className="animate-pulse"
          color="primary"
        >
          Waiting room leader...
        </Typography>
      )}
    </div>
  );
};
