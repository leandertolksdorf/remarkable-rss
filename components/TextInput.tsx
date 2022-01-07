import classNames from "classnames";
import { ChangeEvent } from "react";

type Props = {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent) => void;
};

function TextInput(props: Props) {
  return (
    <input
      type={props.type || "text"}
      placeholder={props.placeholder}
      spellCheck={false}
      onChange={props.onChange}
      className={classNames(
        "w-full",
        "mb-2",
        "p-2",
        "text-center",
        "outline-none",
        "border",
        "border-gray-400",
        "focus:border-black"
      )}
    ></input>
  );
}

export default TextInput;
