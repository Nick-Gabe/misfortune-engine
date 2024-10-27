type User = {
  name: string;
  id: string;
  answer: string | null;
  points: number;
  pointsHistory: number[];
}

type GameMode = "versus" | "coop";

type RoomScreen = "waitingRoom" | "decidingMisfortune" | "answeringMisfortune" | "outcomeShowcase" | "leaderboard" | "results";

type Room = {
  id: string;
  players: User[];
  gameMode: GameMode;
  screen: RoomScreen;
  currentMisfortune?: {
    announcement: string;
    content: string;
  } | null;
  currentShowcase?: {
    user: User;
    outcome: {
      points: number;
      content: string;
    } | null
  } | null;
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