import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

function RemarkableConnectForm() {
  const router = useRouter();

  const [oneTimeCode, setOneTimeCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnectAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/device_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oneTimeCode }),
      });
      setLoading(false);
      switch (response.status) {
        case 201:
          router.reload();
          break;
        case 400:
          setError("Invalid one-time code");
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
    <div>
      <p>Connect your reMarkable account to get started!</p>
      <p className={classNames("mb-2")}>
        To do so, visit{" "}
        <a
          href="https://my.remarkable.com/#desktop"
          target="blank"
          className={classNames("text-indigo-500")}
        >
          this link
        </a>
        , copy your one-time code and paste it down below.
      </p>
      <TextInput
        placeholder="your one-time code"
        value={oneTimeCode}
        onChange={(e) => setOneTimeCode((e.target as HTMLInputElement).value)}
      />
      <Button
        label={loading ? "loading... (this could take a while)" : "connect"}
        onClick={handleConnectAccount}
      />
      <p className={classNames("my-2", "text-red-700", "text-sm")}>{error}</p>
    </div>
  );
}

export default RemarkableConnectForm;
