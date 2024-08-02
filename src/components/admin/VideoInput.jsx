import React from "react";

import css from "../../css/admin/add-unit-page.module.css";

const VideoInput = (props) => {
  return (
    <div style={{ marginBottom: "0.8rem" }} className="text-ff2">
      <label htmlFor={props.id}>{props.label}</label>
      <div>
        <input
          className={css.commonInput}
          type="text"
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => {
            props.onChange(e);
          }}
          autoComplete="on"
        />
      </div>
    </div>
  );
};

export default VideoInput;
