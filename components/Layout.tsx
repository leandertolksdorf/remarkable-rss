import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
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
      {props.children}
    </div>
  );
}

export default Layout;
