import React from "react";
import ReactLoading from "react-loading";
import ContentLoader, { Facebook } from "react-content-loader";

const Loader = () => {
  return (
    <div>
      <div className="text-center py-20">
        {/* <ReactLoading
            className="text-center"
            type={"spokes"}
            color={"black"}
            height={"10%"}
            width={"10%"}
          /> */}
        <ContentLoader viewBox="0 0 580 30">
          {/* Only SVG shapes */}
          {/* <rect x="0" y="0" rx="5" ry="5" width="70" height="70" /> */}
          <rect x="20" y="17" rx="4" ry="4" width="500" height="13" />
        </ContentLoader>
        <ContentLoader viewBox="0 0 580 30">
          {/* Only SVG shapes */}
          {/* <rect x="0" y="0" rx="5" ry="5" width="70" height="70" /> */}
          <rect x="20" y="17" rx="4" ry="4" width="500" height="13" />
        </ContentLoader>
        <ContentLoader viewBox="0 0 580 30">
          {/* Only SVG shapes */}
          {/* <rect x="0" y="0" rx="5" ry="5" width="70" height="70" /> */}
          <rect x="20" y="17" rx="4" ry="4" width="500" height="13" />
        </ContentLoader>{" "}
        <ContentLoader viewBox="0 0 580 30">
          {/* Only SVG shapes */}
          {/* <rect x="0" y="0" rx="5" ry="5" width="70" height="70" /> */}
          <rect x="20" y="17" rx="4" ry="4" width="500" height="13" />
        </ContentLoader>
      </div>
    </div>
  );
};
export default Loader;
