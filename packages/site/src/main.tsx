import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

import "./css/base.css";
import "./main.css";
import classes from "./main.module.css";
import { Touch } from "mosfez-touch/touch";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

function Main() {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = divRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!element || !canvas || !context) return;

    const touch = new Touch(element);
    touch.onUpdate(() => {
      const vw = touch.viewportWidth;
      const vh = touch.viewportHeight;

      canvas.width = vw;
      canvas.height = vh;
      context.clearRect(0, 0, vw, vh);
      context.fillStyle = "#FFF";
      context.fillRect(...touch.worldToView(0, 0), 4, 4);
      context.fillRect(...touch.worldToView(10, 0), 4, 4);
      context.fillRect(...touch.worldToView(20, 0), 4, 4);
      context.fillRect(...touch.worldToView(0, 10), 4, 4);
    });
    return () => touch.dispose();
  }, []);

  return (
    <div className={classes.main}>
      <ListHeader>
        mosfez-ui dev site -{" "}
        <a
          className={classes.link}
          href="https://github.com/dxinteractive/mosfez-ui"
        >
          github repo
        </a>
      </ListHeader>
      <div className={classes.content} ref={divRef}>
        <canvas ref={canvasRef} className={classes.canvas} />
      </div>
    </div>
  );
}

type ListHeaderProps = {
  children: React.ReactNode;
};

function ListHeader(props: ListHeaderProps) {
  return (
    <header className={classes.listHeader}>
      <div className={classes.listHeaderTitle}>{props.children}</div>
    </header>
  );
}
