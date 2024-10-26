import { SuperVizRoomProvider } from "@superviz/react-sdk";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../shared/useStorage";
import { RoomWithoutProviders } from "./Room";

const API_KEY = import.meta.env.VITE_SUPERVIZ_API_KEY;

export const Room = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [user] = useLocalStorage<User | null>("user", null);

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <SuperVizRoomProvider
      developerKey={API_KEY}
      group={{ id, name: id }}
      roomId={id}
      participant={user}
    >
      <RoomWithoutProviders />
    </SuperVizRoomProvider>
  );
};
