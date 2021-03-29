import {
  ChangeEvent,
  DetailedHTMLProps,
  LegacyRef,
  MutableRefObject,
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import useClickOutside from "../hooks/useClickOutside";

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: Array<{
    label: string;
    value: string;
  }>;
}

const Select = (props: SelectProps) => {
  const [toggle, setToggle] = useState(false);
  const selectRef = useRef<HTMLSelectElement>();
  const dumbRef = useRef<HTMLDivElement>();
  const listRef = useRef<HTMLDivElement>();
  useClickOutside(listRef as MutableRefObject<HTMLDivElement>, dumbRef, () => {
    if (toggle) {
      setToggle(false);
    }
  });
  useEffect(() => {
    return () => {
      selectRef.current?.removeEventListener("change", () => {});
    };
  }, []);
  return (
    <div className="select">
      <select
        {...props}
        ref={(elm) => {
          elm?.addEventListener("change", function (e) {
            if (props.onChange) {
              props.onChange((e as any) as ChangeEvent<HTMLSelectElement>);
              setToggle(false);
            }
          });
          selectRef.current = elm as HTMLSelectElement;
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          right: "50%",
          visibility: "hidden",
        }}
      >
        {props.options.map(({ label, value }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <div
        ref={dumbRef as LegacyRef<HTMLDivElement>}
        className="select-header"
        onClick={() => {
          setToggle((v) => !v);
        }}
      >
        Prediction processing{" "}
        {!toggle ? (
          <i className="bi bi-chevron-down"></i>
        ) : (
          <i className="bi bi-chevron-up"></i>
        )}
      </div>
      <div
        className="select-option-container"
        ref={listRef as LegacyRef<HTMLDivElement>}
        style={{
          visibility: toggle ? "visible" : "hidden",
        }}
      >
        {toggle &&
          props.options.map((val) => {
            return (
              <div
                className="select-option-list"
                key={val.value}
                onClick={() => {
                  if (selectRef.current) {
                    selectRef.current.value = val.value;
                    selectRef.current.dispatchEvent(new Event("change"));
                  }
                }}
              >
                {val.label}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Select;
