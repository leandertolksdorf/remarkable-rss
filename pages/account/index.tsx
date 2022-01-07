import classNames from "classnames";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import RemarkableConnectForm from "../../components/RemarkableConnectForm";

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
          const json = await response.json();
          setUser(json.user);
          break;
        default:
          router.push("/");
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <Layout loading={!user}>
      <p className={classNames("mb-2")}>Welcome {user?.username}!</p>
      {user?.hasDeviceToken ? (
        "Your reMarkable account is connected!"
      ) : (
        <RemarkableConnectForm />
      )}
      <div className={classNames("mt-5")}>
        <a
          href="#"
          onClick={handleLogout}
          className={classNames("text-indigo-500")}
        >
          logout
        </a>
      </div>
    </Layout>
  );
};
export default Account;
