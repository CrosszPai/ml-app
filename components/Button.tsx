import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  LegacyRef,
  useMemo,
  useRef,
} from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  color?: "peach" | "clear sky";
}

const Button = (props: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>();
  const background = useMemo(() => {
    switch (props.color) {
      case "clear sky":
        return "#AAD4E0";
      case "peach":
        return "#FAAE9F";
      default:
        return "none";
    }
  }, [props.color]);
  return (
    <div
      onClick={() => {
        ref.current?.click();
      }}
      className="button"
      style={{ margin: "auto", background }}
    >
      <button
        {...props}
        ref={ref as LegacyRef<HTMLButtonElement>}
        style={{ visibility: "hidden", position: "absolute" }}
      ></button>
      {props.children}
    </div>
  );
};

export default Button;
