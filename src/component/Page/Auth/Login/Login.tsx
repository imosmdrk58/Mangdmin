import React from "react";
import logo from '../../../../asset/images/logo_web.png';
import '../Auth.scoped.sass';
import { Link } from "react-router-dom";
import { toast_config } from "../../../../config/toast.config";
import { ToastContainer, toast } from "react-toastify";

const origin_url_be = 'http://localhost:3000';

export class AuthLogin extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        this.submitLogin = this.submitLogin.bind(this);
    }

    componentDidMount(): void {
        if(sessionStorage.getItem('access_token')) {
            window.location.href = '/';
            return;
        }
    }

    handleChangeInputEmail = (event: any) => {
        this.setState({
            email: event.target.value,
        });
    }

    handleChangeInputPassword = (event: any) => {
        this.setState({
            password: event.target.value,
        });
    }

    submitLogin = async () => {
        const response = await fetch(
            `${origin_url_be}/api/auth/login`
            , {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                })
            }).then((response) => response.json())

        if (!response.success) {
            toast.warn(response.message.toString(), toast_config);
            return;
        }
        
        sessionStorage.setItem('access_token', response.result.access_token);
        sessionStorage.setItem('refresh_token', response.result.refresh_token);
        
        // đăng nhập thành công về home
        window.location.href = '/';
    }

    render() {
        return (
            <div className="auth">
                <div className="authbox">
                    <Link to={'/'}>
                        <img className="authbox__logo" src={logo} alt="" />
                    </Link>
                    <h1 className="authbox__title">Đăng nhập</h1>
                    <div className="authbox__body">
                        <div>
                            <label htmlFor="email">Email đăng nhập</label>
                            <input id="email" name="email" type="email" placeholder="Nhập email" value={this.state.email} onChange={this.handleChangeInputEmail} />
                        </div>
                        <div>
                            <label htmlFor="password">Mật khẩu</label>
                            <input id="password" name="password" type="password" placeholder="Nhập mật khẩu ít nhất 8 ký tự" value={this.state.password} onChange={this.handleChangeInputPassword} />
                        </div>
                    </div>
                    <div className="authbox__action">
                        <button className="button" onClick={this.submitLogin}>
                            Đăng nhập
                        </button>
                    </div>
                    <div className="authbox__footer">
                        <div>
                            <span>Chưa có tài khoản </span>
                            <Link to={'/auth/register'}>Đăng ký</Link>
                        </div>
                        <div>
                            <span></span>
                            <Link to={'/auth/forget-password'}>Quên mật khẩu</Link>
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}