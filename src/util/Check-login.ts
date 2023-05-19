export function CheckLogin () {
    if(!sessionStorage.getItem('access_token')) {
        window.location.href = '/auth/login';
      }
}