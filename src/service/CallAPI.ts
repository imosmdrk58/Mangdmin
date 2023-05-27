const origin_url_be = 'origin_url_be';

export async function API_updateChapter(id_chapter: number, form_data: FormData) {
  return await fetch(`${origin_url_be}/api/comic/chapter/update/${id_chapter}`, {
    method: 'post',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem('access_token')}`,
    },
    body: form_data,
  });
}

// lấy thông tin thống kê số lượng truyện hay user mới của trang web
export async function API_analysisNewUserOrComic(type: string) {
  return await fetch(`${origin_url_be}/api/${type}/analysis/new-${type}?number_day=7`, {
    method: 'get'
  });
}

// top 3 người dùng tương tấc nhiều nhất
export async function API_theMostInteractiveUser(limit: number) {
  return await fetch(`origin_url_be/api/comment/analysis/the-most-interactive-user?limit=${limit}`, {
    method: 'get'
  });
}

// top 3 truyện được xem nhiều nhất
export async function API_ranking(field: string, limit: number) {
  return await fetch(`origin_url_be/api/comic/ranking?field=${field}&limit=${limit}`, {
    method: 'get'
  });
}

// so sánh sự tăng trưởng hiện tại với ngày trước đỏ về user || comic
export async function API_growPastCurrent(type: string) {
  return await fetch(`origin_url_be/api/${type}/analysis/grow-past-current`, {
    method: 'get'
  });
}

// xoá truyện
export async function API_deleteComic(id_comic: number) {
  return await fetch(`origin_url_be/api/comic/delete/${id_comic}`, {
    method: 'delete',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem('access_token')}`,
    },
  });
}

// lấy tất cả truyện trên hệ thống
export async function API_Graphql_getAllComic() {
  const query = `
  query {
    getAllComic {
         id,
             name,
             thumb,
             like,
             follow,
             view,
             state,
             genres,
             authors,
             another_name,
             brief_desc,
             slug,
             star,
      }
  }
  `;

  return await fetch(`origin_url_be/graphql`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  });
}


// tìm kiếm truyện
export async function API_searchComic(query: any) {
  return await fetch(`origin_url_be/api/comic/search?comic_name=${query.search_name}&filter_state=&filter_author=&filter_genre=&filter_sort=az`, {
    method: 'get'
  });
}

// lấy tất cả thể loại truyện
export async function API_genres() {
  return await fetch(`${origin_url_be}/api/comic/genres`, {
    method: 'get',
  })
}

// lấy 1 truyện theo slug
export async function API_getComicBySlug(slug_comic: string) {
  return await fetch(`${origin_url_be}/api/comic/${slug_comic}`, {
    method: 'get',
  });
}

export async function API_updateComic(id_comic: number, form_data: FormData) {
  return await fetch(`${origin_url_be}/api/comic/update/${id_comic}`, {
    method: 'put',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem('access_token')}`,
    },
    body: form_data,
  })
}

export async function API_createComic(form_data: FormData) {
  return await fetch(`${origin_url_be}/api/comic/create`, {
    method: 'post',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem('access_token')}`,
    },
    body: form_data,
  });
}

export async function API_createChapter(form_data: FormData) {
  return await fetch(`origin_url_be/api/comic/chapter/create`, {
    method: 'post',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem('access_token')}`,
    },
    body: form_data,
  });
}

// lấy tất cả báo cáo đến hệ thống
export async function API_getReports() {
  const query = `
  query {
    getReports(type: "all") {
  id, fullname, email, detail_report, id_object, errors, link, type, is_resolve  }
  }
  `;

  return await fetch(`origin_url_be/graphql`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  })
}

// đánh dâu đã giải quyết vấn đề
export async function API_markSolved(id_report: number, value: boolean) {
  return await fetch(`origin_url_be/api/report/update/${id_report}?is_resolve=${value}`, {
    method: 'put',
  });
}

// lấy thông tin toàn bộ user trên hệ thống
export async function API_getAllUsers() {
  const query = `
    query {
      getAllUser {
           id,
        fullname,
        avatar,
        role,
        email,
        active,
        }
    }
    `;

  return await fetch(`origin_url_be/graphql`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  });
}

// khóa hoặc mở khóa tài khoản user
export async function API_banOrUnbanUser(id_user: number, is_ban: boolean) {
  return await fetch(`origin_url_be/api/user/management/${id_user}?ban=${is_ban}`, {
    method: 'put',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
    },
  });
}

// lấy slide ảnh
export async function API_slideImages() {
  const query = `
        query {
            getSlideImages {
              id,
              link_image
            }
          }`;

  return await fetch(`${origin_url_be}/graphql`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  });
}

// thay đổi ảnh trong slide
export async function API_changeSlideImage(form_data: FormData) {
  return await fetch(`${origin_url_be}/api/admin/change-slide`, {
    method: 'put',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
    },
    body: form_data,
  });
}

// đăng xuất
export async function API_logout() {
  return fetch(`${origin_url_be}/api/auth/logout`, {
    method: 'GET',
    headers: {
      'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
      'Content-Type': 'application/json'
    }
  });
}