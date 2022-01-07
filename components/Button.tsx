import classNames from "classnames";

type Props = {
  type?: "button" | "submit" | "reset";
  label: string;
  onClick?: () => void;
};

function Button(props: Props) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={classNames(
        "w-full",
        "p-2",
        "mb-1",
        "bg-black",
        "text-white",
        "select-none",
        "active:bg-indigo-500"
      )}
    >
      {props.label}
    </button>
  );
}

export default Button;
