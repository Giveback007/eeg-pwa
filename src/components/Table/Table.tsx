import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableHead, TableRow, TableCell } from '../material-ui';
import styles from "./Table.jss";

// FIXME
const useStyles = makeStyles(styles as any);

type P = {
  tableHead?: string[],
  tableData: string[][],
  tableHeaderColor?: NotifyColors | "gray"
};

export default function CustomTable(props: P) {
  const classes = useStyles(props);
  const { tableHead, tableData, tableHeaderColor } = props;

  // FIXME
  const k = (tableHeaderColor + "TableHeader" as keyof typeof classes);

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[k]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {prop.map((prop, key) => {
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};
