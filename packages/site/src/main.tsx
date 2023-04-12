import React from "react";
import ReactDOM from "react-dom/client";

import "./css/base.css";
import "./main.css";
import classes from "./main.module.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

function Main() {
  // const [text, setText] = useState("abc\ndef");
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
