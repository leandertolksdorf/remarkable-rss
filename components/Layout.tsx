import { ArrowRightIcon, RssIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  loading?: boolean;
  children: ReactNode;
};

function Layout(props: Props) {
  return (
    <div
      className={classNames(
        "container",
        "mx-auto",
        "px-5",
        "py-10",
        "text-center"
      )}
    >
      <h1
        className={classNames(
          "font-bold",
          "text-2xl",
          "flex",
          "items-center",
          "justify-center",
          "mb-5"
        )}
      >
        <RssIcon className={classNames("h-8 w-8", "inline")} />
        <ArrowRightIcon className={classNames("h-5 w-5", "inline", "mr-2")} />
        reMarkable
      </h1>
      {props.loading ? "Loading" : props.children}
    </div>
  );
}

export default Layout;
