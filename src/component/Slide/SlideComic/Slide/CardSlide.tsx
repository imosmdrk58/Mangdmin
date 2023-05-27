/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom';
import './CardSlide.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { API_changeSlideImage } from '../../../../service/CallAPI';

export function CardSlide(props: any) {
    return (
        <div className="slide">
            <Link to={'/comic/' + props.comic.slug} className="slide__thumb">
                <img src={props.comic.thumb} alt="" />
            </Link>
            <Link to={'/comic/' + props.comic.slug} className="slide__name">{props.comic.name}</Link>
        </div>
    );
}

export function CardSlideHome(props: any) {
    const [origin_image] = useState(props.image.link_image);
    const [image, SetImage] = useState(props.image.link_image);
    const [file, SetFile] = useState(null);
    const [is_change, SetIsChange] = useState(false);

    const uploadHandler = async (event: any) => {
        SetIsChange(true);
        SetImage(URL.createObjectURL(event.target.files[0]));
        SetFile(event.target.files[0]);
    }

    const confirmChange = () => {
        if (file) {
            const form_data = new FormData();

            form_data.append('file', file);
            form_data.append('index', props.image.id);

            API_changeSlideImage(form_data).then((response) => {
                response.json().then((data) => {
                    console.log(data);
                })
            });
        }
    }

    const refuseChange = () => {
        SetIsChange(false);
        SetImage(origin_image);
    }

    return (
        <div className="slide">
            <img className="slide__thumb" src={image} alt="" />
            <div className='slide__camera' >
                {
                    !is_change ?
                        <div>
                            <input name='upload-file' id='upload-file' type="file" onChange={uploadHandler} />
                            <label htmlFor="upload-file">
                                <FontAwesomeIcon icon={faCamera} />
                            </label>
                        </div>
                        :
                        <div>
                            <FontAwesomeIcon className='confirm-change' icon={faCheck} onClick={confirmChange} />
                            <FontAwesomeIcon className='refuse-change' icon={faXmark} onClick={refuseChange} />
                        </div>
                }
            </div>
        </div>
    );
}