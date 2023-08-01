import { Tweet as ReactTweet } from "react-tweet";

export const Tweet = ({ id }: { id: string }) => (
  <ReactTweet id={id} apiUrl={id ? `/api/tweet/${id}` : undefined} />
);
