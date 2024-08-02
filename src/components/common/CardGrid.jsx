import React from "react";

export const CardGrid = (props) => {
  return (
    <div className={`${props.className}`} style={{ marginTop: "0.625rem", ...props.style }}>
      <div className="row">{props.children}</div>
    </div>
  );
};
 