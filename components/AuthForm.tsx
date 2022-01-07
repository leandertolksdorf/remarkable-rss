import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

function AuthForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      switch (response.status) {
        case 201:
          router.push("/account");
          break;
        case 400:
          setError("Please check input values");
          break;
        case 409:
          setError("This user already exists");
          break;
        default:
          setError("Server");
          break;
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      switch (response.status) {
        case 200:
          router.push("/account");
          break;
        case 400:
          setError("Please check input values");
          break;
        case 401:
          setError("Please check your password");
          break;
        case 404:
          setError("This user doesn't exist");
          break;
        default:
          setError("Server");
          break;
      }
    } catch (e: any) {
      console.log("error", e.status);
    }
  };
  return (
    <div>
      <TextInput
        placeholder="username"
        value={username}
        onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
      />
      <TextInput
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
      />
      <Button label="create account" onClick={handleCreateAccount} />
      <Button label="sign in" onClick={handleSignIn} />
      <p className={classNames("my-2", "text-red-700", "text-sm")}>{error}</p>
    </div>
  );
}

export default AuthForm;
