import React from "react";
import SyncLoader from "react-spinners/SyncLoader";

/*
Reference: 
Center align a div:
https://stackoverflow.com/questions/5012111/how-to-position-a-div-in-the-middle-of-the-screen-when-the-page-is-bigger-than-t
*/

const override = {
  position: "fixed",
  top: "50%",
  left: "50%",
  width: "200px",
  marginLeft: "-100px",
  textAlign: "center",
};

const Loader = () => {
  return (
    <div style={override}>
      <SyncLoader
        // color="red"
        color="grey"
        loading={true}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
