import React from "react";

import css from "../../css/admin/add-unit-page.module.css";

const TextInput = (props) => {
  return (
    <textarea
      className={css.textArea}
      name="text"
      id="text"
      label="Text"
      placeholder="Text"
      rows={10}
      width={100}
      value={props.value}
      onChange={(e) => {
        props.onChange(e);
      }}
    />
  );
};

export default TextInput;
