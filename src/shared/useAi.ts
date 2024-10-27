import { useMutation, useQuery } from "react-query";

export const useAiQuery = ({
  messages,
  user,
  room,
}: {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  user: User;
  room: Room | null;
}) => useQuery({
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchInterval: false,
  refetchIntervalInBackground: false,
  cacheTime: 0,
  enabled: user.id === room?.players[0].id,
  queryFn: async (): Promise<OpenAIResponse> =>
    await (
      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          temperature: 0.8,
        }),
      })
    ).json(),
});

export const useAiMutation = () => useMutation({
  mutationFn: async (messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[]): Promise<OpenAIResponse> =>
    await (
      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          temperature: 0.8,
        }),
      })
    ).json(),
});