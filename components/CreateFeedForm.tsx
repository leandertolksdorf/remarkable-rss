import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

function CreateFeedForm() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleCreateFeed = async () => {
    try {
      const response = await fetch("/api/user/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      switch (response.status) {
        case 201:
          router.reload();
          break;
        case 400:
          setError("Please check the URL");
          break;
        case 409:
          setError("This feed already exists");
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
    <div className={classNames("")}>
      <h3 className={classNames("font-bold", "text-xl", "mb-2")}>
        Add new feed
      </h3>
      <TextInput
        placeholder="feed url"
        value={url}
        onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
      />
      <Button label="Add +" onClick={handleCreateFeed} />
      <p className={classNames("my-2", "text-red-700", "text-sm")}>{error}</p>
    </div>
  );
}

export default CreateFeedForm;
