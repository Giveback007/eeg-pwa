import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./Card.style";

// FIXME
const useStyles = makeStyles(styles as any);

type P = {
  className?: string,
  plain?: boolean,
  profile?: boolean,
  chart?: boolean,
  children?: React.ReactNode,
}

export default function Card(props: P) {
  const classes = useStyles();
  const { className, children, profile, plain, chart, ...rest } = props;

  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    // FIXME
    [className as any]: className !== undefined
  });
  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
}
