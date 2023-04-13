import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

import "./css/base.css";
import "./main.css";
import classes from "./main.module.css";
import { Touch, UpdateProps } from "mosfez-touch/touch";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

function Main() {
  const [, setTouchProps] = useState<UpdateProps | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = divRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!element || !canvas || !context) return;

    const touch = new Touch(element);
    touch.onUpdate((props) => {
      setTouchProps(props);
      canvas.width = props.viewportWidth;
      canvas.height = props.viewportHeight;
      context.clearRect(0, 0, props.viewportWidth, props.viewportHeight);
      context.fillStyle = "#FFF";
      context.fillRect(0, 0, 4, 4);
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
