import React from "react";

// My css
import secCardCss from "../../css/common/sec-card.module.css";

const SecCard = (props) => {
  return <div className={secCardCss.outerDiv}>{props.children}</div>;
};

export default SecCard;
