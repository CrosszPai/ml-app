import { LegacyRef, useRef, useState } from "react";
import { predictResponse, Result } from "../interfaces";

const IndexPage = () => {
  const ref = useRef<HTMLInputElement>();
  const [preview, setPreview] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState<Result[]>([]);
  const [err, setError] = useState<boolean>(false);
  const onClick = () => {
    if (ref.current?.files?.[0]) {
      const form = new FormData();
      form.append("image", ref.current.files[0]);
      setProcessing(true);
      setError(false);
      fetch("/api/tensor", {
        method: "POST",
        body: form,
      })
        .then((res) => res.json() as Promise<predictResponse>)
        .then((data) => {
          if (data.data === -1) {
            setError(true);
          } else {
            setData(data.data);
          }
        })
        .finally(() => {
          setProcessing(false);
        });
    }
  };

  return (
    <div
      style={{
        display: "block",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <div>
        {preview ? (
          <img
            style={{
              maxWidth: 400,
              maxHeight: 400,
            }}
            src={preview}
          ></img>
        ) : (
          <div
            style={{
              height: "300px",
              width: "300px",
              margin: "auto",
              marginBottom: "2rem",
              border: "1px solid black",
            }}
          ></div>
        )}
      </div>
      <div>
        <input
          onChange={(e) => {
            setPreview(URL.createObjectURL(e.target.files?.[0]));
          }}
          ref={ref as LegacyRef<HTMLInputElement>}
          type="file"
        ></input>
        <div
          style={{
            marginTop: "2rem",
          }}
        >
          <button onClick={onClick}>upload</button>
        </div>
      </div>
      {processing
        ? "processing"
        : data.map((val) => {
            return (
              <p key={val.name}>
                {val.name} : {val.prop} %
              </p>
            );
          })}
      {err && "unkown"}
    </div>
  );
};

export default IndexPage;
