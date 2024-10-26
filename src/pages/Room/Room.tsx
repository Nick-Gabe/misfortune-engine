import { SuperVizRoomProvider, WhoIsOnline } from "@superviz/react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../../shared/useStorage";
import { useEffect } from "react";

const API_KEY = import.meta.env.VITE_SUPERVIZ_API_KEY;

const RoomWithoutProviders = () => {
  return (
    <main>
      <div
        className="absolute bottom-4 right-4 bg-white/50 p-2 rounded-full"
        id="online"
      />
      <WhoIsOnline position="online" disableFollowMe />
    </main>
  );
};

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
    return navigate("/");
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
