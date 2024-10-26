import { SuperVizRoomProvider } from "@superviz/react-sdk";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../shared/useStorage";
import { RoomWithoutProviders } from "./Room";
import { useCallback, useEffect } from "react";

const API_KEY = import.meta.env.VITE_SUPERVIZ_API_KEY;

export const Room = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [user] = useLocalStorage<User | null>("user", null);

  const navigateToHome = useCallback(() => {
    navigate(`/?room=${id}`);
  }, [id, navigate]);

  useEffect(() => {
    if (!user) {
      navigateToHome();
    }
  }, [navigateToHome, user]);

  return (
    <SuperVizRoomProvider
      developerKey={API_KEY}
      group={{ id, name: id }}
      roomId={id}
      participant={user!}
    >
      <RoomWithoutProviders />
    </SuperVizRoomProvider>
  );
};
