type User = {
  name: string;
  id: string;
}

type GameMode = "versus" | "coop";

type RoomScreen = "waitingRoom" | "decidingMisfortune";

type Room = {
  id: string;
  players: User[];
  gameMode: GameMode;
  screen: RoomScreen;
}