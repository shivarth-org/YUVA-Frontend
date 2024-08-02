import React from "react";

// My components
import css from "../../css/common/card.module.css";

function Card(props) {
    return (
        <div className={css.cardDiv}>
            {props.type === "course" ? null : (
                <img
                    className={css.cardImg}
                    src={
                        props.type === "vertical"
                            ? props.data.imgSrc
                            : props.data.vdoThumbnail
                    }
                    alt={props.data.name}
                />
            )}
            <div className={css.cardDetails}>
                <p className={css.cardName}>
                    {props.type === "unit"
                        ? props.data.video.title
                        : props.data.name}
                </p>
                <p className={css.cardDesc}>
                    {props.type === "unit"
                        ? props.data.video.desc
                        : props.data.desc}
                </p>

                <p className={css.cardCount}>
                    {props.type === "vertical"
                        ? props.data.courseCount + " Courses"
                        : props.type === "course"
                        ? props.data.unitCount + " Units"
                        : props.data.activityCount +
                          " Activities • " +
                          props.data.quizCount +
                          " Questions"}
                </p>
                <div className={css.cardBtns}>
                    {props.type === "unit" ? null : (
                        <button
                            className={css.cardViewBtn}
                            style={{
                                display: "inline",
                                width: "fit-content",
                                padding: "0 5% 0 5%",
                                backgroundColor: "var(--yuva-green)",
                            }}
                            id={props.data._id}
                            onClick={(e) => {
                                props.onAddViewClick(e);
                            }}
                        >
                            Add / View{" "}
                            {props.type === "vertical"
                                ? "courses"
                                : props.type === "course"
                                ? "units"
                                : "unit"}
                        </button>
                    )}
                    <button
                        className={css.cardDltBtn}
                        style={{
                            display: "inline",
                            width: "fit-content",
                            padding: "0 5% 0 5%",
                        }}
                        id={props.data._id}
                        onClick={(e) => {
                            props.onDeleteClick(e);
                        }}
                    >
                        <i
                            id={props.data._id}
                            style={{ color: "var(--card-dlt-red)" }}
                            className="fa-sharp fa-solid fa-trash"
                        ></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;

// function Card(props) {
//   // (props);
//   return (
//       <div className={css.cardDiv}>
//           {props.type === "course" ? null : (
//               <img
//                   className={css.cardImg}
//                   src={
//                       props.type === "vertical"
//                           ? props.data.imgSrc
//                           : props.data.vdoThumbnail
//                   }
//                   alt={props.data.name}
//               />
//           )}
//           <div className={css.cardDetails}>
//               <p className={css.cardName}>
//                   {props.type === "unit"
//                       ? props.data.video.title
//                       : props.data.name}
//               </p>
//               <p className={css.cardDesc}>
//                   {props.type === "unit"
//                       ? props.data.video.desc
//                       : props.data.desc}
//               </p>

//               <p className={css.cardCount}>
//                   {props.type === "vertical"
//                       ? props.data.courseCount + " Courses"
//                       : props.type === "course"
//                       ? props.data.unitCount + " Units"
//                       : props.data.quizCount + " Questions"}
//               </p>
//               <p
//                   className={css.cardCount}
//                   style={{ textDecoration: "none", fontSize: "14px" }}
//               >
//                   {props.type === "vertical"
//                       ? props.data.certUnlocked +
//                         " Certificates Unlocked by Users"
//                       : ""}
//               </p>

//               <button
//                   className={css.cardViewBtn}
//                   id={props.data._id}
//                   onClick={(e) => {
//                       props.onClick(e);
//                   }}
//               >
//                   View{" "}
//                   {props.type === "vertical"
//                       ? "courses"
//                       : props.type === "course"
//                       ? "units"
//                       : "unit"}
//               </button>
//           </div>
//       </div>
//   );
// }

// export default Card;
