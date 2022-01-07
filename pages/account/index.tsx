import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

const Account: NextPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const getCurrentUser = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      switch (response.status) {
        case 200:
          const user = await response.json();
          setUser(user);
          break;
        default:
          router.push("/");
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <Layout loading={!user}>
      <p>Welcome {user?.username}!</p>
      <p>
        {user?.hasDeviceToken
          ? "Your reMarkable account is connected!"
          : "Connect your reMarkable account to get started!"}
      </p>
    </Layout>
  );
};
export default Account;
