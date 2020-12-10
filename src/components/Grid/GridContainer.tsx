import React from "react";
import type { GridProps } from "@material-ui/core";
import { Grid } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

const styles = {
  grid: {
    margin: "0 -15px !important",
    width: "unset"
  }
};

type P = {
  classes: {
    grid: string;
  };
};

type Props = P & Pick<GridProps, Exclude<keyof GridProps, keyof P>>

function GridContainer(props: Props) {
  const { classes, children, ...rest } = props;

  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default withStyles(styles)(GridContainer)
