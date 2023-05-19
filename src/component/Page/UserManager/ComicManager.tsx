import React from "react";
import { ReactNode } from "react";
import { EnhancedTable } from "../../table/TableUser/TableUser";
import { CheckLogin } from "../../../util/Check-login";

export class UserManager extends React.Component<any, any> {
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
      <div> 
        <EnhancedTable />
      </div>
    )
  }
}