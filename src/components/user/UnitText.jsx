import React from "react";

// My css
import css from "../../css/user/unit-text.module.css";

const UnitText = (props) => {
  let textLenthInWords = props.text.split(" ").length;
  const averageReadSpeedInMin = 200;
  const timeToRead = (textLenthInWords / averageReadSpeedInMin).toFixed(1);

  return (
    <div className="text-ff2">
      <div className={css.timeDiv}>
        <span>
          (Approx time to read: <b>{timeToRead}</b> min)
        </span>
      </div>
      <p className={css.unitText}>{props.text}</p>
      {/* <pre className={css.unitText}>{props.text}</pre> */}
    </div>
  );
};

export default UnitText;
