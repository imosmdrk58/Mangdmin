/* eslint-disable array-callback-return */
import React from "react";
import { ReactNode } from "react";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faExpand, faImage, faRemove } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { toast_config } from "../../../../config/toast.config";
import slugify from "slugify";
import './UpdateComicChapter.scoped.sass';
import '../CreateComic/CreateComic.scoped.sass';
import '../CreateChapter/CreateChapter.scoped.sass';
import { API_genres, API_getComicBySlug, API_updateChapter, API_updateComic } from "../../../../service/CallAPI";

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

export class UpdateComicChapter extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      comic: {},
      chapters: [],
      is_update_chapter: false,
    };
  }

  render(): ReactNode {
    return (
      <Grid container>
        <Grid item xs={12}>
          <UpdateComic />
        </Grid>
        <Grid item xs={12}>
          <UpdateChapter />
        </Grid>
      </Grid>
    );
  }
}

class UpdateComic extends React.Component<any, any> {
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
    const slug_comic = window.location.href.split('/')[window.location.href.split('/').length - 1];

    await API_genres().then(async (response) => {
      const json_response = await response.json();
      this.setState({
        genres: json_response.result,
      });
    });

    await API_getComicBySlug(slug_comic).then(async (response) => {
      const json_response = await response.json();

      this.setState({
        comic: {
          ...json_response.result.comic,
          authors: json_response.result.comic.authors.join(','),
        },
        chapters: json_response.result.chapters,
      }, () => {
        this.setState({
          image: this.state.comic.thumb,
        });
        this.initChoosenGenre();
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
    }, () => {
      console.log(this.state.comic);
    });
  }

  updateComic = async () => {
    if (this.state.comic.name === '' ||
      this.state.comic.another_name === '' ||
      this.state.comic.genres.length === 0) {
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

    await API_updateComic(this.state.comic.id, form_data).then(async (response) => {
      const json_response = await response.json();
      if (json_response.success) {
        toast.success(json_response.message.toString(), toast_config);
      } else {
        toast.error(json_response.message.toString(), toast_config);
      }
    })
  }

  initChoosenGenre = () => {
    // thiết lập genre đã được chọn trước đó
    this.setState({
      choosen_genres: this.state.comic.genres,
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
            element_cb.checked = true;
          }
        }
      }
    });
  }

  render(): ReactNode {
    return (
      <div className="form__createcomic">
        <div className="form__createcomic-item">
          <span className="title-page">CẬP NHẬT TRUYỆN</span>
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
                  <Grid item md={4} key={ele.slug}>
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
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <label htmlFor="choose-image-comic" className="upload-image choose-image">
                <FontAwesomeIcon className="upload-image-icon" icon={faCamera} />
              </label>
              <input style={{ display: 'none' }} type="file" id="choose-image-comic" name="choose-image-comic" onChange={this.showChoosenImage} />
            </Grid>
            <Grid item xs={6}>
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
          <Button color="success" variant="contained" onClick={this.updateComic}>
            CẬP NHẬT TRUYỆN
          </Button>
        </div>
      </div>
    );
  }
}

class UpdateChapter extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      origin_chapters: [],
      images: [],
      chapters: [],
      is_show_image_large: false,
      image_large: '',
      posistion_change: [],
      map_pos_file: new Map(), // lưu trữ vị trí (key) và file (value) thay đổi ở vị trí đó 
      chapter: {
        id: '',
        name: '',
        files: [],
        id_comic: NaN,
      }
    };
  }

  async componentDidMount() {
    const slug_comic = window.location.href.split('/')[window.location.href.split('/').length - 1];
    await API_getComicBySlug(slug_comic).then(async (response) => {
      const json_response = await response.json();

      this.setState({
        chapters: json_response.result.chapters.map((ele: any) => ({ label: `${ele.id}/${ele.name}` })),
        origin_chapters: json_response.result.chapters,
        chapter: {
          ...this.state.chapter,
          id_comic: json_response.result.comic.id,
        },
      });
    });
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

  chooseChapter = (event: any) => {
    this.setState({
      chapter: {
        ...this.state.chapter,
        id: parseInt(event.target.textContent.split('/')[0]),
        name: event.target.textContent.split('/')[1].toString(),
      },
    }, () => {
      this.state.origin_chapters.map((ele: any) => {
        if (ele.id === parseInt(event.target.textContent.split('/')[0])) {
          this.setState({
            images: ele.images,
          });
        }
      })
    })
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

  expandImage = (image_link: any) => {
    this.setState({
      is_show_image_large: !this.state.is_show_image_large,
      image_large: image_link,
    });
  }

  closeImageLarge = () => {
    this.setState({
      is_show_image_large: !this.state.is_show_image_large,
    });
  }

  changeImage = (event: any, pos: number) => {
    if (event.target.files.length !== 0) {
      const copy_images = this.state.images;
      copy_images[pos] = URL.createObjectURL(event.target.files[0]);

      this.setState({
        images: copy_images,
        map_pos_file: this.state.map_pos_file.set(pos, event.target.files[0]),
      });
    }
  }

  updateChapter = async () => {
    if (this.state.chapter.name === '' || Number.isNaN(this.state.chapter.id_comic)) {
      toast.warning('Vui lòng điền đầy đủ thông tin!', toast_config);
      return;
    }

    // lấy vị trí thay đổi ảnh và file thay đổi
    const copy_position_change = this.state.posistion_change;
    const copy_files = this.state.chapter.files;

    this.state.map_pos_file.forEach((value: string, key: number, map: any) => {
      if (!copy_position_change.includes(key)) {
        copy_position_change.push(key);
      }

      if (!copy_files.includes(value)) {
        copy_files.push(value);
      }
    });

    const form_data = new FormData();
    for (const i of this.state.chapter.files) {
      form_data.append('files', i);
    }
    form_data.append('change_image_at', copy_position_change);
    form_data.append('name', this.state.chapter.name);
    form_data.append('id_comic', this.state.chapter.id_comic);

    await API_updateChapter(this.state.chapter.id, form_data).then(async (response) => {
      const json_response = await response.json();
      if (json_response.success) {
        this.setState({
          images: [],
          chapter: {
            ...this.state.chapter,
            name: '',
            files: [],
          },
          origin_chapters: [],
          posistion_change: [],
          map_pos_file: new Map(), // lưu trữ vị trí (key) và file (value) thay đổi ở vị trí đó 
        });
        toast.success(json_response.message.toString(), toast_config);
      }
    })
  }

  render(): ReactNode {
    return (
      <div className="form__createchapter">
        <div className="form__createcomic-item">
          <span className="title-page">CẬP NHẬT CHAPTER</span>
        </div>
        <div className="form__createchapter-item">
          <Autocomplete
            disablePortal
            id="combo-box-chapter"
            options={this.state.chapters}
            onChange={this.chooseChapter}
            renderInput={(params) => <TextField {...params} label="Tên chapter" />}
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
                    <FontAwesomeIcon className="expand-image" icon={faExpand} onClick={() => this.expandImage(ele)} />
                    <label htmlFor={"change-image-" + index} className="upload-image choose-image">
                      <FontAwesomeIcon className="change-image" icon={faCamera} />
                    </label>
                    <input style={{ display: 'none' }} type="file" id={"change-image-" + index} name={"change-image-" + { index }} onChange={(event: any) => this.changeImage(event, index)} />
                  </div>
                </Grid>
              ))
            }
          </Grid>
        </div>
        <div>
          <Button color="success" variant="contained" onClick={this.updateChapter}>
            CẬP NHẬT CHAPTER
          </Button>
        </div>
        {this.state.is_show_image_large && <div id="image-large">
          <img src={this.state.image_large} alt="" />
          <FontAwesomeIcon className="remove-image" icon={faRemove} onClick={this.closeImageLarge} />
        </div>}
      </div>
    );
  }
}