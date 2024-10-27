import { Button } from "@mui/material";
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
  );
};
