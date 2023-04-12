import React, { useEffect, useRef, useState } from "react";
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

function stringifyEvent(e: Event | undefined): string {
  if (!e) return "null";

  const obj = {};
  for (const k in e) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[k] = e[k];
  }
  return JSON.stringify(
    obj,
    (k, v) => {
      if (v instanceof Node) return "Node";
      if (v instanceof Window) return "Window";
      return v;
    },
    " "
  );
}

function Main() {
  const [log] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const touch = new Touch(element);
    return () => touch.dispose();
  }, []);

  return (
    <div className={classes.main}>
      <ListHeader>
        mosfez-ui test site -{" "}
        <a
          className={classes.link}
          href="https://github.com/dxinteractive/mosfez-ui"
        >
          github repo
        </a>
      </ListHeader>
      <div className={classes.content} ref={ref}>
        {log}
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
