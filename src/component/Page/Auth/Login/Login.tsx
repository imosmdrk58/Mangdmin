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
                    <h1 className="authbox__title">Giriş Yap</h1>
                    <div className="authbox__body">
                        <div>
                            <label htmlFor="email">Giriş e-postası</label>
                            <input id="email" name="email" type="email" placeholder="email" value={this.state.email} onChange={this.handleChangeInputEmail} />
                        </div>
                        <div>
                            <label htmlFor="password">Şifre</label>
                            <input id="password" name="password" type="password" placeholder=" En az 8 karakterden oluşan bir şifre girin" value={this.state.password} onChange={this.handleChangeInputPassword} />
                        </div>
                    </div>
                    <div className="authbox__action">
                        <button className="button btn btn-primary" onClick={this.submitLogin}>
                            Giriş Yap
                        </button>
                    </div>
                </div>
                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}
