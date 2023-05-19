import React from "react";
import { ReactNode } from "react";
import './SiderBar.scoped.sass';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBookTanakh, faFlag, faGauge, faUserSecret } from "@fortawesome/free-solid-svg-icons";

export class SideBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    };

    this.activeNavigation = this.activeNavigation.bind(this);
  }

  componentDidMount(): void {
    const cur_page = window.location.href.split('/')[window.location.href.split('/').length - 1];
    document.querySelector('.nav-item-active')?.classList.remove('nav-item-active');
    if (cur_page === '') {
      document.getElementById('dashboard')?.classList.add('nav-item-active');
    } else if (cur_page === 'create-chapter' || cur_page === 'create-comic') {
      document.getElementById('comic-management')?.classList.add('nav-item-active');
    } else {
      document.getElementById(cur_page)?.classList.add('nav-item-active');
    }
  }

  activeNavigation = (event: any) => {
    document.querySelector('.nav-item-active')?.classList.remove('nav-item-active');
    event.target.classList.add('nav-item-active');
  }

  render(): ReactNode {
    return (
      <nav id="sidebar">
        <div className="sidebar__header">
          {this.props.isSmallSideBar
            ? <a href="/">MH</a>
            : <a href="/" >MANGA HAY</a>
          }
        </div>
        <ul className="sidebar__nav">
          <li className="nav-item nav-category">
            {this.props.isSmallSideBar
              ? <span>Nav</span>
              : <span>Navigation</span>
            }
          </li>
          <Link id="dashboard" to={'/'} className="nav-item nav-item-flex nav-item-active" onClick={this.activeNavigation}>
            <span className="nav-item-icon">
              <FontAwesomeIcon icon={faGauge} color="#0f8edd" />
            </span>
            {!this.props.isSmallSideBar && <span className="nav-item-text">Dashboard</span>}
          </Link>
          <div>
            <Link id="comic-management" to={'/comic-management'} className="nav-item nav-item-flex" onClick={this.activeNavigation}>
              <span className="nav-item-icon">
                <FontAwesomeIcon icon={faBookTanakh} color="#ae4ad9" />
              </span>
              {!this.props.isSmallSideBar && <span className="nav-item-text">Thư viện truyện</span>}
            </Link>
            {
              !this.props.isSmallSideBar
              &&
              <ul className="nav-item-child">
                <li>
                  <Link className="nav-item-child-navigate" to={'/comic-management/create-comic'}>
                    Tạo truyện
                  </Link>
                </li>
                <li>
                  <Link className="nav-item-child-navigate" to={'/comic-management/create-chapter'}>
                    Tạo chapter
                  </Link>
                </li>
              </ul>
            }
          </div>
          <Link id="user-management" to={'/user-management'} className="nav-item nav-item-flex" onClick={this.activeNavigation}>
            <span className="nav-item-icon">
              <FontAwesomeIcon icon={faUserSecret} color="#5aba70" />
            </span>
            {!this.props.isSmallSideBar && <span className="nav-item-text">Người dùng</span>}
          </Link>
          <Link id="report-management" to={'/report-management'} className="nav-item nav-item-flex" onClick={this.activeNavigation}>
            <span className="nav-item-icon">
              <FontAwesomeIcon icon={faFlag} color="#fef200" />
            </span>
            {!this.props.isSmallSideBar && <span className="nav-item-text">Báo cáo</span>}
          </Link>
          <Link id="notify-management" to={'/notify-management'} className="nav-item nav-item-flex" onClick={this.activeNavigation}>
            <span className="nav-item-icon">
              <FontAwesomeIcon icon={faBell} color="#df4a32" />
            </span>
            {!this.props.isSmallSideBar && <span className="nav-item-text">Thông báo</span>}
          </Link>
          <li className="nav-item nav-category">
            Khác
          </li>
        </ul>
      </nav>
    )
  }
}