import type { GridProps } from "@material-ui/core";
import { Grid } from '../material-ui';
import { withStyles } from "@material-ui/core/styles";

const styles = {
  grid: {
    padding: "0 15px !important"
  }
};

type P = {
  classes: {
    grid: string;
  };
};

type Props = P & Pick<GridProps, Exclude<keyof GridProps, keyof P>>

const GridItem = (props: Props) => {
  const { classes, children, ...rest } = props;

  return <Grid item {...rest} className={classes.grid}>
      {children}
  </Grid>
};

export default withStyles(styles)(GridItem);
