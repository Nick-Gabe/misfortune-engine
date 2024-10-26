import { Typography } from "@mui/material";

type GamemodeDescriptionProps = {
  gamemode: "coop" | "versus";
};

export const GamemodeDescription = (props: GamemodeDescriptionProps) => {
  const gamemodeInfo = {
    coop: {
      title: "Cooperative Mode",
      description: "Work together to solve the puzzle.",
    },
    versus: {
      title: "Versus Mode",
      description: `Each round, a misfortune is chosen by the AI, and your objetive is to find a way to survive it using your own words and knowledge.
        
      The AI will then decide if you survive or not, based on your explanation. Try to be the smartest person in the room and survive the most!
      
      After 5 rounds, the player with the most survival points wins the game and becomes the Infortunate Master!`,
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
    </div>
  );
};
