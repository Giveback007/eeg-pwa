import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./CardIcon.style";

const useStyles = makeStyles(styles);

type P = {
  className: string,
  color: NotifyColors,
  children?: React.ReactNode
}

export default function CardIcon(props: P) {
  const classes = useStyles();
  const { className, children, color, ...rest } = props;

  // FIXME
  const k = (color + "CardHeader" as keyof typeof classes);

  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [k]: color,
    [className]: className !== undefined
  });
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  );
}
