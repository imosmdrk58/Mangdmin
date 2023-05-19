import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export class AlertDialogSlide extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      is_open: false,
    };
  }

  componentDidMount(): void {
    this.setState({
      is_open: this.props.open,
    });
  }

  handleClose = () => {
    this.setState({
      is_open: false,
    });
  };

  render(): React.ReactNode {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Hủy</Button>
            <Button onClick={this.handleClose}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
}