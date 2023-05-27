import React from "react";
import { ReactNode } from "react";
import './DashBoard.scoped.sass';
import { Grid } from "@mui/material";
import { StretchCard } from "../../Card/StretchCard/StretchCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { SlideComic } from "../../Slide/SlideComic/SlideComic";
import { CheckLogin } from "../../../util/Check-login";
import { API_analysisNewUserOrComic, API_growPastCurrent, API_ranking, API_theMostInteractiveUser } from "../../../service/CallAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

const options_top_3_view_comic = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Top 3 truyện được xem nhiều nhất',
    },
  },
};

const options_top_3_interactive_user = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Top 3 người dùng tương tác nhiều nhất',
    },
  },
};

const options_new_comic_user = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Lượng truyện và user mới trong 7 ngày gần đây',
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
}

export class Dashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      chart_new_user: [],
      data_chart_new_user: {
        labels: [],
        datasets: [],
      },
      chart_new_comic: [],
      data_chart_new_comic: {
        labels: [],
        datasets: [],
      },
      stretchcard_new_user: {},
      stretchcard_new_comic: {},
      data_chart_new_user_comic: {
        labels: [],
        datasets: [],
      },
      chart_top_3_view_comic: [],
      data_chart_top_3_view_comic: {
        labels: [],
        datasets: [],
      },
      chart_top_3_interactive_user: [],
      data_chart_top_3_interactive_user: {
        labels: [],
        datasets: [],
      },
    };

    this.setDataChartNewUser = this.setDataChartNewUser.bind(this);
    this.setDataChartNewComic = this.setDataChartNewComic.bind(this);
    this.setDataNewChartNewUserComic = this.setDataNewChartNewUserComic.bind(this);
    this.setDataTop3ViewComic = this.setDataTop3ViewComic.bind(this);
    this.setDataTop3InteractiveUser = this.setDataTop3InteractiveUser.bind(this);
  }

  async componentDidMount() {
    CheckLogin();
    
    const reponse_new_user = await API_analysisNewUserOrComic('user').then(async (response) => response.json());
    const response_new_comic = await API_analysisNewUserOrComic('comic').then(async (response) => response.json());

    this.setState({
      chart_new_user: reponse_new_user.result,
      chart_new_comic: response_new_comic.result,
    }, () => {
      this.setDataChartNewUser();
      this.setDataChartNewComic();
      this.setDataNewChartNewUserComic();
    });

    await API_growPastCurrent('comic').then(async (response) => {
      const data = await response.json();
      this.setState({
        stretchcard_new_comic: data.result,
      });
    })

    await API_growPastCurrent('user').then(async (response) => {
      const data = await response.json();
      this.setState({
        stretchcard_new_user: data.result,
      });
    })

    await API_ranking('view', 3).then(async (response) => {
      const data = await response.json();
      this.setState({
        chart_top_3_view_comic: data.result,
      }, () => {
        this.setDataTop3ViewComic();
      });
    })

    await API_theMostInteractiveUser(3).then(async (response) => {
      const data = await response.json();
      this.setState({
        chart_top_3_interactive_user: data.result,
      }, () => {
        this.setDataTop3InteractiveUser();
      });
    })
  }

  setDataTop3InteractiveUser = () => {
    const labels = this.state.chart_top_3_interactive_user.map((ele: any) => ele.fullname);
    this.setState({
      data_chart_top_3_interactive_user: {
        labels,
        datasets: [{
          label: 'Lượt comment',
          data: this.state.chart_top_3_interactive_user.map((ele: any) => parseInt(ele.count)),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
        }],
      }
    });
  }

  setDataTop3ViewComic = () => {
    let labels = this.state.chart_top_3_view_comic.map((ele: any) => ele.name.length > 30 ? ele.name.slice(0, 30) + '...' : ele.name);

    this.setState({
      data_chart_top_3_view_comic: {
        labels,
        datasets: [{
          label: 'Lượt xem',
          data: this.state.chart_top_3_view_comic.map((ele: any) => ele.view),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
        }],
      }
    });
  }

  setDataNewChartNewUserComic = () => {
    const labels = this.state.chart_new_user.map((ele: any) => ele.date);
    this.setState({
      data_chart_new_user_comic: {
        labels,
        datasets: [{
          label: 'Lượng người dùng mới',
          data: this.state.chart_new_user.map((ele: any) => ele.value),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          yAxisID: 'y',
        }, {
          label: 'Lượng truyện mới',
          data: this.state.chart_new_comic.map((ele: any) => ele.value),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgb(53, 162, 235)',
          yAxisID: 'y1',
        }],
      }
    });
  }

  setDataChartNewUser = () => {
    const labels = this.state.chart_new_user.map((ele: any) => ele.date);
    this.setState({
      data_chart_new_user: {
        labels,
        datasets: [{
          label: 'Lượng người dùng mới',
          data: this.state.chart_new_user.map((ele: any) => ele.value),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          yAxisID: 'y',
        }],
      }
    });
  }

  setDataChartNewComic = () => {
    const labels = this.state.chart_new_comic.map((ele: any) => ele.date);
    this.setState({
      data_chart_new_comic: {
        labels,
        datasets: [{
          label: 'Lượng truyện mới',
          data: this.state.chart_new_comic.map((ele: any) => ele.value),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgb(53, 162, 235)',
          yAxisID: 'y1',
        }],
      }
    });
  }

  render(): ReactNode {
    return (
      <div className="dashboard">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SlideComic />
          </Grid>
          <Grid item xs={12}>
          </Grid>
          <Grid item xs={3}>
            <StretchCard name={'Lượng user mới'} data={this.state.stretchcard_new_user} />
          </Grid>
          <Grid item xs={3}>
            <StretchCard name={'Lượng truyện mới'} data={this.state.stretchcard_new_comic} />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '10px' }}>
          <Grid item xs={6}>
            <Bar className="style-barchart" options={options_top_3_interactive_user} data={this.state.data_chart_top_3_interactive_user} />
          </Grid>
          <Grid item xs={6}>
            <Bar className="style-barchart" options={options_top_3_view_comic} data={this.state.data_chart_top_3_view_comic} />
          </Grid>
          <Grid item xs={6}>
            <Line className="style-barchart" options={options_new_comic_user} data={this.state.data_chart_new_user_comic} />
          </Grid>
        </Grid>
      </div>
    );
  }
}