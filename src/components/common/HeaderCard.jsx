import React from "react";

// My css
import css from "../../css/common/header-card.module.css";

const HeaderCard = (props) => {
  return <div className={css.headerDiv}>{props.children}</div>;
};

export default HeaderCard;
