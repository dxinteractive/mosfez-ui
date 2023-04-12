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
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    const touch = new Touch(ref);
    return () => {
      touch.dispose();
    };
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
      <div className={classes.content} ref={ref}></div>
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
