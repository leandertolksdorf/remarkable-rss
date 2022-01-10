import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  feeds: {
    url: string;
    title: string;
    _id: string;
  }[];
};

function FeedList(props: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const handleDeleteFeed = async (id: string) => {
    try {
      const response = await fetch("/api/user/feed/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      switch (response.status) {
        case 200:
          router.reload();
          break;
        case 401:
          setError("Authentication Error");
          break;
        case 404:
          setError("Feed not found");
          break;
        default:
          setError("Server Error");
          break;
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className={classNames("mb-5")}>
      <h3 className={classNames("font-bold", "text-xl", "mb-2")}>Your Feeds</h3>
      {error && <p className={classNames("text-red-500")}>{error}</p>}
      {props.feeds.map((feed) => (
        <div
          className={classNames(
            "bg-gray-100",
            "border",
            "border-gray-400",
            "p-2",
            "mb-2"
          )}
        >
          <p className={classNames("font-bold")}>{feed.title}</p>
          <p className={classNames("font-mono")}>{feed.url}</p>
          <p
            className={classNames(
              "text-red-700",
              "active:text-black",
              "select-none",
              "cursor-pointer",
              "inline-block"
            )}
            onClick={() => handleDeleteFeed(feed._id)}
          >
            delete
          </p>
        </div>
      ))}
    </div>
  );
}

export default FeedList;
