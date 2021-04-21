import { LegacyRef, useRef, useState } from "react";
import Button from "../components/Button";
import Select from "../components/Select";
import { usePredict } from "../hooks/usePredict";

const METHOD = [
  {
    label: "On server",
    value: "server",
  },
  {
    label: "On your device",
    value: "local",
  },
];

const IndexPage = () => {
  const [page, setPage] = useState<"index" | "about" | "info">("index");
  const inputRef = useRef<HTMLInputElement>();
  const img = useRef<HTMLImageElement>();
  const [method, setMethod] = useState<"local" | "server">("server");
  const [preview, setPreview] = useState<File>();
  const [{ processing, result, clear, error }, predict] = usePredict();
  const onClick = () => {
    if (preview && img.current) {
      predict(method, method === "local" ? img.current : preview);
    }
  };

  return (
    <div className="app">
      <div className="config">
        <Select
          onChange={(e) => {
            setMethod(e.target.value as any);
          }}
          options={METHOD}
        />
      </div>
      {page === "index" ? (
        <div className="image-manage-container main">
          <p
            style={{
              textAlign: "right",
              marginTop: 0,
              color: "#BDBDBD",
            }}
          >
            On {method}
          </p>
          <p
            style={{
              fontFamily: "th-sans-serif",
              fontSize: "1.5rem",
            }}
          >
            กะเพรา ? โหระพา ? สะระแหน่ ? ยี่หร่า ?
          </p>
          <div
            style={{
              position: "relative",
              marginBottom: "2rem",
            }}
          >
            {preview ? (
              <img
                ref={img as LegacyRef<HTMLImageElement>}
                style={{
                  maxWidth: '100%',
                  borderRadius: 8,
                }}
                src={URL.createObjectURL(preview)}
              ></img>
            ) : (
              <>
                <img src="placeholder.svg" className="placeholder-image"></img>
              </>
            )}
            {preview ? (
              result.length === 0 &&
              !error && (
                <img
                  className="picture-manage-bar"
                  src="add-bar-accepted.svg"
                  onClick={() => {
                    if (confirm("Delete image ?")) {
                      setPreview(undefined);
                    }
                  }}
                ></img>
              )
            ) : (
              <>
                <label
                  style={{
                    visibility: "hidden",
                  }}
                >
                  <input
                    ref={inputRef as LegacyRef<HTMLInputElement>}
                    onChange={(e) => {
                      setPreview(e.target.files?.[0]);
                    }}
                    type="file"
                    className="picture-manage-bar"
                  ></input>
                </label>
                <img
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                  className="picture-manage-bar"
                  src="add-bar.svg"
                ></img>
              </>
            )}
          </div>
          {!preview && (
            <p className="instructtion-text">
              Click ‘ + ‘ to insert a picture or take a picture <br /> of a leaf
              to check{" "}
            </p>
          )}
          <div className="result">
            {error && <p>Unpredictable</p>}
            {processing
              ? "processing"
              : result.map((val) => {
                  return (
                    <p key={val.name}>
                      {val.name} : {val.prop} %
                    </p>
                  );
                })}
          </div>
          {preview && result.length === 0 && !error && (
            <Button
              color="clear sky"
              style={{
                marginTop: "2rem",
                textAlign: "center",
              }}
              onClick={onClick}
            >
              Accept
            </Button>
          )}
          {preview && (result.length > 0 || error) && (
            <Button
              color="peach"
              style={{
                marginTop: "2rem",
                textAlign: "center",
              }}
              onClick={() => {
                clear();
                setPreview(undefined);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      ) : page === "about" ? (
        <div
          className="main"
          style={{ textAlign: "center", position: "relative" }}
        >
          <img className="about-img" src="about.svg"></img>
          <i
            style={{
              position: "absolute",
              fontSize: "2rem",
              cursor: "pointer",
              transform: "translateX(-3rem)",
            }}
            onClick={() => {
              setPage("index");
            }}
            className="bi bi-x"
          ></i>
        </div>
      ) : (
        <></>
      )}
      <div className="information" style={{ display: "flex" }}>
        <div style={{ marginLeft: "auto" }}>
          <i
            style={{
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "5px 7px",
              background: page === "info" ? "white" : "none",
              borderRadius: 99,
            }}
            className="bi bi-journal-medical"
            onClick={() => {
              setPage("info");
            }}
          ></i>
        </div>
        <div>
          <i
            style={{
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "5px 7px",
              background: page === "about" ? "white" : "none",
              borderRadius: 99,
            }}
            className="bi bi-people"
            onClick={() => {
              setPage("about");
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
