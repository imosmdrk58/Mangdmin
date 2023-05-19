import React from "react";
import logo from '../../../../asset/images/logo_web.png';
import '../Auth.scoped.sass';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast_config } from "../../../../config/toast.config";

const origin_url_be = 'http://localhost:3000';

export class AuthRegister extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            fullname: '',
            email: '',
            password: '',
            confirm_password: '',
        };

        this.submitData = this.submitData.bind(this);
    }

    componentDidMount(): void {
        if(sessionStorage.getItem('access_token')) {
            window.location.href = '/';
            return;
        }
    }

    handleChangeInputFullname = (event: any) => {
        this.setState({
            fullname: event.target.value,
        });
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

    handleChangeInputConfirmPassword = (event: any) => {
        this.setState({
            confirm_password: event.target.value,
        });
    }

    submitData = async () => {
        if (this.state.confirm_password !== this.state.password) {
            toast.warn('Mật khẩu xác nhận không khớp!', toast_config);
            return;
        }
        
        const response = await fetch(
            `${origin_url_be}/api/auth/admin/register`
            , {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullname: this.state.fullname,
                    email: this.state.email,
                    password: this.state.password,
                })
            }).then((response) => response.json())

        if(!response.success) {
            toast.warn(response.message.toString(), toast_config);
            return;
        }

        toast.success(response.message.toString(), toast_config);
        this.setState({
            fullname: '',
            email: '',
            password: '',
            confirm_password: '',
        });
    }

    render() {
        return (
            <div className="auth">
                <div className="authbox">
                    <Link to={'/'}>
                        <img className="authbox__logo" src={logo} alt="" />
                    </Link>
                    <h1 className="authbox__title">Đăng ký</h1>
                    <div className="authbox__body">
                        <div>
                            <label htmlFor="fullname">Tên đầy đủ</label>
                            <input id="fullname" name="fullname" type="text" placeholder="Nhập họ và tên" value={this.state.fullname} onChange={this.handleChangeInputFullname} />
                        </div>
                        <div>
                            <label htmlFor="email">Email đăng nhập</label>
                            <input id="email" name="email" type="email" placeholder="Nhập email" value={this.state.email} onChange={this.handleChangeInputEmail} />
                        </div>
                        <div>
                            <label htmlFor="password">Mật khẩu</label>
                            <input id="password" name="password" type="password" placeholder="Nhập password" value={this.state.password} onChange={this.handleChangeInputPassword} />
                        </div>
                        <div>
                            <label htmlFor="passwordconfirm">Mật khẩu</label>
                            <input id="passwordconfirm" name="passwordconfirm" type="password" placeholder="Nhập lại password" value={this.state.confirm_password} onChange={this.handleChangeInputConfirmPassword} />
                        </div>
                    </div>
                    <div className="authbox__action" onClick={this.submitData}>
                        <button className="button">
                            Đăng ký
                        </button>
                    </div>
                    <div className="authbox__footer">
                        <div>
                            <span>Đã có tài khoản </span>
                            <Link to={'/auth/login'}>đăng nhập</Link>
                        </div>
                        <div>
                            <span></span>
                            <a href="/auth/forget-password">Quên mật khẩu</a>
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}