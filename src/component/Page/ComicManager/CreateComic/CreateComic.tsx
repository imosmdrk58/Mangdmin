import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { ReactNode } from "react";
import './CreateComic.scoped.sass';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCamera, faImage } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { toast_config } from "../../../../config/toast.config";
import slugify from "slugify";
import { CheckLogin } from "../../../../util/Check-login";
import { API_createComic, API_genres } from "../../../../service/CallAPI";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ]
}

export class CreateComic extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      image: '',
      file_image: {},
      genres: [],
      choosen_genres: [],
      comic: {
        name: '',
        another_name: '',
        genres: [],
        authors: [],
        brief_desc: '',
        file: undefined,
      }
    };
  }

  async componentDidMount() {
    CheckLogin();

    await API_genres().then(async (response) => {
      const json_response = await response.json();
      this.setState({
        genres: json_response.result,
      });
    });
  }

  showChoosenImage = (event: any) => {
    if (event.target.files.length !== 0) {
      this.setState({
        image: URL.createObjectURL(event.target.files[0]),
        comic: {
          ...this.state.comic,
          file: event.target.files[0],
        },
      });
    }
  }

  chooseGenres = (event: any) => {
    let new_genres = this.state.choosen_genres;

    if (event.target.checked) {
      if (!new_genres.includes(event.target.value)) {
        new_genres.push(event.target.value);
      }
    } else {
      new_genres = new_genres.filter((ele: any) => ele !== event.target.value);
    }

    this.setState({
      choosen_genres: new_genres,
      comic: {
        ...this.state.comic,
        genres: new_genres,
      },
    });
  }

  setComic = (event: any, field: string) => {
    const new_comic = { ...this.state.comic };

    if (field === 'brief_desc') {
      new_comic[field] = event;
    } else {
      new_comic[field] = event.target.value;
    }

    this.setState({
      comic: new_comic,
    });
  }

  createComic = async () => {
    if (this.state.comic.name === '' ||
      this.state.comic.another_name === '' ||
      this.state.comic.genres.length === 0 ||
      !this.state.comic.file) {
      toast.warning('Vui lòng điền đầy đủ thông tin!', toast_config);
      return;
    }

    const form_data = new FormData();
    form_data.append('file', this.state.comic.file);
    form_data.append('name', this.state.comic.name);
    form_data.append('another_name', this.state.comic.another_name);
    form_data.append('genres', this.state.comic.genres);
    form_data.append('authors', this.state.comic.authors.length !== 0 ? this.state.comic.authors.split(',') : 'Đang cập nhật');
    form_data.append('brief_desc', this.state.comic.brief_desc !== '' ? this.state.comic.brief_desc : 'Đang cập nhật');

    await API_createComic(form_data).then(async (response) => {
      const json_response = await response.json();

      if (json_response.success) {
        this.setState({
          comic: {
            name: '',
            another_name: '',
            genres: [],
            authors: [],
            brief_desc: '',
            file: undefined,
          },
          image: '',
        }, () => {
          if (this.state.choosen_genres.length !== 0) {
            for (const genre of this.state.choosen_genres) {
              const genre_slug = slugify(genre, {
                replacement: '-',
                remove: undefined,
                lower: true,
                strict: false,
                locale: 'vi',
                trim: true
              });

              if (document.getElementById(`${genre_slug}`)) {
                const element_cb = document.getElementById(`${genre_slug}`) as HTMLInputElement;
                element_cb.checked = false;
              }
            }

            this.setState({
              choosen_genres: [],
            });
          }
        });
        toast.success(json_response.message.toString(), toast_config);
      }
    })
  }

  render(): ReactNode {
    return (
      <div className="form__createcomic">
        <div className="form__createcomic-item">
          <span className="title-page">ĐĂNG TRUYỆN</span>
        </div>
        <div className="form__createcomic-item">
          <TextField fullWidth id="comic-name" label="Tên truyện" variant="outlined" value={this.state.comic.name} onChange={(event) => this.setComic(event, 'name')} />
        </div>
        <div className="form__createcomic-item">
          <TextField fullWidth id="comic-another_name" label="Tên khác" variant="outlined" value={this.state.comic.another_name} onChange={(event) => this.setComic(event, 'another_name')} />
        </div>
        <div className="form__createcomic-item">
          <TextField fullWidth id="comic-authors" label="Tên tác giả" variant="outlined" value={this.state.comic.authors.toString()} onChange={(event) => this.setComic(event, 'authors')} />
        </div>
        <div className="form__createcomic-item text-editor">
          <ReactQuill id="comic-brief_desc" modules={modules} theme="snow" value={this.state.comic.brief_desc} onChange={(event) => this.setComic(event, 'brief_desc')} />
        </div>
        <div className="form__createcomic-item">
          <div className="item-title">
            Thể loại truyện:
          </div>
          <div className="item-body">
            <Grid container>
              {
                this.state.genres && this.state.genres.map((ele: any) => (
                  <Grid item md={3} key={ele.slug}>
                    <div className="genre-item">
                      <input className="inputgenre__item" id={ele.slug} type="checkbox" name="inputgenre" value={ele.genre} onChange={this.chooseGenres}></input>
                      <label htmlFor={ele.slug}>{ele.genre}</label><br></br>
                    </div>
                  </Grid>
                ))
              }
            </Grid>
          </div>
        </div>
        <div className="form__createcomic-item">
          <Grid container>
            <Grid item xs={5}>
              <label htmlFor="choose-image" className="upload-image choose-image">
                <FontAwesomeIcon className="upload-image-icon" icon={faCamera} />
              </label>
              <input style={{ display: 'none' }} type="file" id="choose-image" name="choose-image" onChange={this.showChoosenImage} />
            </Grid>
            <Grid item xs={2}>
              <div className="upload-image upload-image-convert">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </Grid>
            <Grid item xs={5}>
              {
                this.state.image === '' ?
                  <div className="upload-image">
                    <FontAwesomeIcon className="upload-image-icon" icon={faImage} />
                  </div>
                  : <div className="upload-image">
                    <img src={this.state.image} alt="" />
                  </div>
              }
            </Grid>
          </Grid>
        </div>

        <div>
          <Button color="success" variant="contained" onClick={this.createComic}>
            ĐĂNG TRUYỆN
          </Button>
        </div>
      </div>
    );
  }
}
