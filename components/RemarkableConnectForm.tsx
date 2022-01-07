import classNames from "classnames";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

function RemarkableConnectForm() {
  const [oneTimeCode, setOneTimeCode] = useState("");

  const handleConnectAccount = () => {};

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
      <Button label="connect" onClick={handleConnectAccount} />
    </div>
  );
}

export default RemarkableConnectForm;
