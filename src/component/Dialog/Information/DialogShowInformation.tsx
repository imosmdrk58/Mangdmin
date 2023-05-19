import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './DialogShowInformation.scoped.sass';

export default function DialogShowInformationComic(props: any) {
  const handleClose = () => {
    props.showDetailInformationComic(false, {});
  };

  return (
    <React.Fragment>
      <Dialog
        maxWidth={'sm'}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>Thông tin truyện {props.comic.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className='comic-information'>
              <div>
                <span>Tên khác: </span>
                {props.comic.another_name}
              </div>
              <div><span>Tình trạng: </span> {props.comic.state}</div>
              <div><span>Lượt xem: </span>{props.comic.view}</div>
              <div><span>Lượt thích: </span>{props.comic.like}</div>
              <div><span>Lượt theo dõi: </span>{props.comic.follow}</div>
              <div><span>Đánh giá: </span>{props.comic.star}*</div>
              <div>
                <span>Nội dung: </span>
                <span dangerouslySetInnerHTML={{ __html: props.comic.brief_desc }}>
                </span>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}