import React, { memo } from "react";
import { Grid } from "react-loader-spinner";

export const Loader: React.FC = memo(() => (
  <Grid
    height={40}
    width={40}
    color="#FFFFFF"
    ariaLabel="grid-loading"
    radius={6}
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />
));
