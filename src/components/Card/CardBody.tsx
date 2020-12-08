import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./CardBody.style";

// FIXME
const useStyles = makeStyles(styles as any);

type P = {
  className?: string;
  plain?: boolean;
  profile?: boolean;
  children?: React.ReactNode;
}

export default function CardBody(props: P) {
  const classes = useStyles();
  const { className, children, plain, profile, ...rest } = props;
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    // FIXME
    [className as any]: className !== undefined
  });
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  );
}
