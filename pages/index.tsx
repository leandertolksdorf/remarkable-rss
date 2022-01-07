import classNames from "classnames";
import type { NextPage } from "next";
import AuthForm from "../components/AuthForm";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <p className={classNames("mb-2")}>
        This is a utility app for reading rss feeds on your reMarkable tablet.
        <br />
        Create an account or sign in to get started!
      </p>
      <AuthForm />
    </Layout>
  );
};

export default Home;
