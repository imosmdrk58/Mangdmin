import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import React from "react";
import { ReactNode } from "react";
import './CreateChapter.scoped.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faRemove } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { toast_config } from "../../../../config/toast.config";
import { CheckLogin } from "../../../../util/Check-login";
import { API_Graphql_getAllComic, API_createChapter } from "../../../../service/CallAPI";

export class CreateChapter extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      comics: [],
      images: [],
      chapter: {
        name: '',
        files: [],
        id_comic: this.props.id_comic ? this.props.id_comic : NaN,
      }
    };
  }

  async componentDidMount() {
    CheckLogin();
    
    await API_Graphql_getAllComic()
      .then(async (response) => {
        const json_response = await response.json();

        this.setState({
          comics: json_response.data.getAllComic.map((ele: any) => ({ label: `${ele.id}/${ele.name}` })),
        });
      })
  }

  setChapter = (event: any, field: string) => {
    const new_chapter = { ...this.state.chapter };

    if (field === 'id_comic') {
      new_chapter[field] = parseInt(event.target.textContent.split('/')[0]);
    } else {
      new_chapter[field] = event.target.value;
    }

    this.setState({
      chapter: new_chapter,
    }, () => {
      console.log(this.state.chapter);
    });
  }

  showChoosenImage = (event: any) => {
    if (event.target.files.length !== 0) {
      this.setState({
        images: this.state.images.concat(Array.from(event.target.files).map((ele: any) => URL.createObjectURL(ele))),
        chapter: {
          ...this.state.chapter,
          files: event.target.files,
        },
      });
    }
  }

  removeImage = (image_link: any) => {
    this.setState({
      images: this.state.images.filter((ele: any) => ele !== image_link),
    });
  }

  createChapter = async () => {
    if(this.state.chapter.name === '' || this.state.chapter.files.length === 0 || Number.isNaN(this.state.chapter.id_comic)) {
      toast.warning('Vui lòng điền đầy đủ thông tin!', toast_config);
      return;
    }

    const form_data = new FormData();
    for(const i of this.state.chapter.files) {
      form_data.append('files', i);
    }
    form_data.append('name', this.state.chapter.name);
    form_data.append('id_comic', this.state.chapter.id_comic);

    await API_createChapter(form_data).then(async(response) => {
      const json_response = await response.json();
      if(json_response.success) {
        this.setState({
          images: [],
          chapter: {
            ...this.state.chapter,
            name: '',
            files: [],
          },
        });
        toast.success(json_response.message.toString(), toast_config);
      }
    })
  }

  render(): ReactNode {
    return (
      <div className="form__createchapter">
        <div className="form__createcomic-item">
          <span className="title-page">ĐĂNG CHAPTER</span>
        </div>
        <div className="form__createchapter-item">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={this.state.comics}
            onChange={(event) => this.setChapter(event, 'id_comic')}
            renderInput={(params) => <TextField {...params} label="Tên truyện" />}
          />
        </div>
        <div className="form__createchapter-item">
          <TextField fullWidth id="chapter-name" label="Tên chapter" variant="outlined" value={this.state.chapter.name} onChange={(event) => this.setChapter(event, 'name')} />
        </div>
        <div className="form__createchapter-item">
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <label htmlFor="choose-image" className="upload-image choose-image">
                <FontAwesomeIcon className="upload-image-icon" icon={faImage} />
              </label>
              <input style={{ display: 'none' }} type="file" multiple id="choose-image" name="choose-image" onChange={this.showChoosenImage} />
            </Grid>
            {
              this.state.images.length !== 0 &&
              this.state.images.map((ele: any, index: number) => (
                <Grid item xs={4} key={index}>
                  <div className="upload-image">
                    <img src={ele} alt="" />
                    <FontAwesomeIcon className="remove-image" icon={faRemove} onClick={() => this.removeImage(ele)} />
                  </div>
                </Grid>
              ))
            }
          </Grid>
        </div>
        <div>
          <Button color="success" variant="contained" onClick={this.createChapter}>
            ĐĂNG CHAPTER
          </Button>
        </div>
      </div>
    );
  }
}