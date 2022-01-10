import classNames from "classnames";
import Link from "next/link";

type Props = {
  type?: "button" | "submit" | "reset";
  label: string;
  onClick?: () => void;
  href?: string;
};

function Button(props: Props) {
  return (
    <Link href={props.href || "#"}>
      <div
        onClick={props.onClick}
        className={classNames(
          "cursor-pointer",
          "w-full",
          "p-2",
          "mb-2",
          "bg-black",
          "text-white",
          "select-none",
          "active:bg-indigo-500",
          "border",
          "border-black"
        )}
      >
        {props.label}
      </div>
    </Link>
  );
}

export default Button;
