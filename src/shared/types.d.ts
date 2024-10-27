type User = {
  name: string;
  id: string;
  answer: string | null;
  points: number;
  pointsHistory: number[];
}

type GameMode = "versus" | "coop";

type RoomScreen = "waitingRoom" | "decidingMisfortune" | "misfortuneDecided" | "outcomeShowcase" | "leaderboard";

type Room = {
  id: string;
  players: User[];
  gameMode: GameMode;
  screen: RoomScreen;
  currentMisfortune?: {
    announcement: string;
    content: string;
  };
  currentShowcase?: {
    user: User;
    outcome: {
      points: number;
      content: string;
    } | null
  };
}

type OpenAIResponse = {
  choices: {
    index: number
    message: {
      role: string;
      content: string;
    };
  }[];
}

declare module 'animated-backgrounds'