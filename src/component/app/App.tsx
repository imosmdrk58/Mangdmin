import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React, { ReactNode } from "react";
import './App.scoped.sass';
import { SideBar } from '../SideBar/SideBar';
import { ComicManager } from '../Page/ComicManager/ComicManager';
import { Header } from '../Header/Header';
import { Dashboard } from '../Page/Dashboard/DashBoard';
import { UserManager } from '../Page/UserManager/ComicManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReportManager } from '../Page/ReportManager/ReportManager';
import { CreateComic } from '../Page/ComicManager/CreateComic/CreateComic';
import { CreateChapter } from '../Page/ComicManager/CreateChapter/CreateChapter';
import { AuthLogin } from '../Page/Auth/Login/Login';
import { UpdateComicChapter } from '../Page/ComicManager/UpdateComicChapter/UpdateComicChapter';

export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSmallSideBar: false,
    };
    this.setIsSmallSideBar = this.setIsSmallSideBar.bind(this);
  }

  setIsSmallSideBar = (value: boolean) => {
    this.setState({
      isSmallSideBar: value,
    });
  }

  render(): ReactNode {
    return (
      <div id="app">
        <BrowserRouter>
          <div id="app__sidebar">
            <SideBar isSmallSideBar={this.state.isSmallSideBar} />
          </div>
          <div id="app__body">
            <div id="app__header">
              <Header setIsSmallSideBar={this.setIsSmallSideBar} />
            </div>
            <div id='app__container'>
              <Routes>
                <Route path='/' element={<Dashboard />}></Route>
                <Route path='/auth/login' element={<AuthLogin />}></Route>
                <Route path='/comic-management' element={<ComicManager />}></Route>
                <Route path='/comic-management/create-comic' element={<CreateComic />}></Route>
                <Route path='/comic-management/create-chapter' element={<CreateChapter />}></Route>
                <Route path='/comic-management/update/:slug' element={<UpdateComicChapter />}></Route>
                <Route path='/user-management' element={<UserManager />}></Route>
                <Route path='/report-management' element={<ReportManager />}></Route>
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        <ToastContainer />
      </div>
    )
  }
}