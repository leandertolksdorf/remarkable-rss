import { ArrowRightIcon, RssIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  loading?: boolean;
  children: ReactNode;
};

function Layout(props: Props) {
  return (
    <div className={classNames("container", "mx-auto", "px-5", "text-center")}>
      <h1
        className={classNames(
          "font-bold",
          "text-2xl",
          "flex",
          "items-center",
          "justify-center",
          "my-16"
        )}
      >
        <RssIcon className={classNames("h-8 w-8", "inline")} />
        <ArrowRightIcon className={classNames("h-5 w-5", "inline", "mr-2")} />
        reMarkable
      </h1>
      {props.loading ? "Loading" : props.children}
      <div className={classNames("mt-5")}>
        This is an open-source community project. If you find any bugs or miss
        features, consider writing issues or creating a pull request!
        <br />
        <a
          href="https://github.com/leandertolksdorf/remarkable-rss"
          target="_blank"
          className={classNames("text-indigo-500")}
        >
          Repository
        </a>
      </div>
    </div>
  );
}

export default Layout;
