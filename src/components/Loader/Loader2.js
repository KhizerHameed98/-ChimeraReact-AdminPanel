import React from "react";
import ReactLoading from "react-loading";

const Loader = () => {
  return (
    <div>
      <div className="max-w-xs mx-auto ">
        <div className="text-center mt-3 " style={{ marginLeft: "30px" }}>
          <ReactLoading
            className="text-center"
            type={"spokes"}
            color={"black"}
            height={"10%"}
            width={"10%"}
          />
        </div>
      </div>
    </div>
  );
};
export default Loader;
