import { Typography } from "@mui/material";

type PlayerListProps = {
  players: User[];
  onCopyLink: () => void;
};

export const PlayerList = (props: PlayerListProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h3" fontWeight="bold" color="primary">
        Players
      </Typography>

      {props.players.map((player) => (
        <div
          key={player.id}
          className="flex items-center gap-2 bg-slate-500 p-4 rounded-lg"
        >
          <Typography variant="body1" fontWeight="bold">
            {player.name}
          </Typography>
        </div>
      ))}
      <button
        className="flex items-center gap-2 bg-transparent border-2 border-slate-500 p-4 rounded-lg text-slate-400 border-dashed hover:bg-slate-700"
        onClick={props.onCopyLink}
      >
        <Typography variant="body1">
          Share the room to invite more players
        </Typography>
      </button>
    </div>
  );
};
