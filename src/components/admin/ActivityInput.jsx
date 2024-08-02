import React from "react";

import css from "../../css/admin/add-unit-page.module.css";

const ActivityInput = (props) => {
  return (
    <div style={{ marginBottom: "1.5rem" }} className="text-ff2">
      <input
        className={css.commonInput}
        type="text"
        id={props.id}
        placeholder="Enter activity"
        value={props.value || ""}
        onChange={(e) => props.handleActivityChange(props.index, e)}
      />

      <div style={{ textAlign: "right" }}>
        <button
          className={css.removeBtn}
          onClick={() => props.handleDeleteActivity(props.index)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ActivityInput;
