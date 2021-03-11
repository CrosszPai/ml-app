import { LegacyRef, useEffect, useRef, useState } from "react";
import { usePredict } from "../hooks/usePredict";
import { predictResponse, Result } from "../interfaces";

const IndexPage = () => {
  const ref = useRef<HTMLInputElement>();
  const img = useRef<HTMLImageElement>();
  const methodRef = useRef<HTMLSelectElement>();
  const [preview, setPreview] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState<Result[]>([]);
  const [err, setError] = useState<boolean>(false);
  const [{ processing: localPorcessing, result }, predict] = usePredict();
  useEffect(() => {
    setData(result);
  }, [result]);
  const onClick = () => {
    if (methodRef.current?.value == "server") {
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
    } else {
      predict(img.current as HTMLImageElement);
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
            ref={img as LegacyRef<HTMLImageElement>}
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
      {processing || localPorcessing
        ? "processing"
        : data.map((val) => {
            return (
              <p key={val.name}>
                {val.name} : {val.prop} %
              </p>
            );
          })}
      {err && "unkown"}
      <select ref={methodRef as LegacyRef<HTMLSelectElement>}>
        <option value="local">local</option>
        <option value="server">server</option>
      </select>
    </div>
  );
};

export default IndexPage;
