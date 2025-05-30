const Url = 'https://dash.tadrisyar.com/api/tadrisyar';
 
const apiKey = ({
  sendsms : `${Url}/sendsms`, // /:num
  login : `${Url}/login`,
  getuserbyid : `${Url}/getuser`, // /id
  ticket : `${Url}/ticket`,
  authentication : `${Url}/authentication`,
  putuser : `${Url}/putuser`, //id
  course : `${Url}/course`,
  video : `${Url}/video`,
  userscourse : `${Url}/users/course`,
  withdrawalMoney : `${Url}/withdrawalMoney`,
  getcode : `${Url}/getcode`,
  tickettext : `${Url}/tickettext`,
  putuser : `${Url}/putuser`, // id
  adminsendsms : `${Url}//admin/sendsms`, // id
  adminlogin : `${Url}/admin/login`, // id
  deletuser : `${Url}/deletuser`, // id
  usd : `${Url}/usd`, // id
  eur : `${Url}/eur`, // id
  pay : `${Url}/pay`, // id
  
});




export default apiKey