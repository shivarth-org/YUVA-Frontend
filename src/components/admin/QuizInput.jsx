import React from "react";

import css from "../../css/admin/add-unit-page.module.css";

// ! use checked attr for checkbox, dont use value attr, it produces bugs

const QuizInput = (props) => {
  return (
    <div style={{ marginBottom: "2rem" }} className="text-ff2">
      <label htmlFor="question">Question {props.quizItemIdx + 1}</label>
      <div>
        <input
          type="text"
          className={css.commonInput}
          id="question"
          placeholder="Question"
          name="question"
          value={props.quizItem.question || ""}
          onChange={(e) => props.handleQuizItemChange(props.quizItemIdx, -1, e)}
        />
        <div style={{ textAlign: "right" }}>
          <button
            className={css.removeBtn}
            onClick={() =>
              props.handleDeleteQuizItem(props.quizItemIdx, -1, null)
            }
          >
            Remove
          </button>
        </div>
      </div>

      <div>
        {props.quizItem.options.map((option, optIdx) => {
          return (
            <div className="my-3" key={props.quizItemIdx * 11 + optIdx}>
              <input
                className="form-check-input mx-3 my-0"
                type="checkbox"
                name="optCheckbox"
                checked={option.isChecked || false}
                onChange={(e) =>
                  props.handleQuizItemChange(props.quizItemIdx, optIdx, e)
                }
              />
              <input
                className={css.optInput}
                type="text"
                name="optText"
                placeholder={`Option ${optIdx + 1}`}
                value={option.text || ""}
                onChange={(e) =>
                  props.handleQuizItemChange(props.quizItemIdx, optIdx, e)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizInput;
