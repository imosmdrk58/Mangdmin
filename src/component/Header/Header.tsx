import React from "react";
import { ReactNode } from "react";
import './Header.scoped.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";

const origin_url_be = 'http://localhost:3000';

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSmallSideBar: false,
    };
  }

  resizeSmallSideBar = () => {
    this.setState({
      isSmallSideBar: !this.state.isSmallSideBar,
    });

    this.props.setIsSmallSideBar(!this.state.isSmallSideBar);
  }

  logoutAdmin = () => {
    fetch(`${origin_url_be}/api/auth/logout`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
        'Content-Type': 'application/json'
      }
    })

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");

    window.location.href = '/auth/login';
  }

  render(): ReactNode {
    return (
      <nav className="header">
        <div className="header__left">
          <div className="header__action-menu" onClick={this.resizeSmallSideBar}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
        <div className="header__right">
          <Button color="error" variant="contained" onClick={this.logoutAdmin}>Đăng xuất</Button>
        </div>
      </nav>
    )
  }
}