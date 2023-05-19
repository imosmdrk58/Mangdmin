import React from "react";
import { ReactNode } from "react";
import { TableReport } from "../../table/TableReport/TableReport";
import { CheckLogin } from "../../../util/Check-login";

export class ReportManager extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {

    };
  }

  componentDidMount(): void {
    CheckLogin();
  }

  render(): ReactNode {
    return (
      <TableReport />
    );
  }
}