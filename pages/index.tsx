import { LegacyRef, useRef, useState } from "react";
import { css } from "@emotion/react";
import useSWR, { mutate } from "swr";
import { predictResponse } from "../interfaces";

const IndexPage = () => {
  const { data } = useSWR<predictResponse>("/api/tensor");
  const ref = useRef<HTMLInputElement>();
  const [preview, setPreview] = useState<string>();
  const onClick = () => {
    if (ref.current?.files?.[0]) {
      const form = new FormData();
      form.append("image", ref.current.files[0]);
      mutate("/api/tensor", async () => {
        const res = await fetch("/api/tensor", {
          method: "POST",
          body: form,
        });
        return (await res.json()) as predictResponse;
      });
    }
  };

  return (
    <div
      css={css`
        display: block;
        width: 100vw;
        text-align: center;
      `}
    >
      <div>
        {preview ? (
          <img
            css={css`
              max-width: 400px;
              max-height: 400px;
            `}
            src={preview}
          ></img>
        ) : (
          <div
            css={css`
              height: 300px;
              width: 300px;
              margin: auto;
              margin-bottom: 2rem;
              border: 1px solid black;
            `}
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
        <div>
          <button onClick={onClick}>upload</button>
        </div>
        {data?.data === 0 ? "Catto" : data?.data === 1 ? "Doggo" : "unknown"}
      </div>
    </div>
  );
};

export default IndexPage;
