import axios from 'axios';

export function visitsDelete (visit: any) {
  return axios.delete(process.env.REACT_APP_URL + '/visit/' + visit.id)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function clientsDelete (client: any) {
  return axios.delete(process.env.REACT_APP_URL + '/clients/' + client.id)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function usersDelete (user: any) {
    return axios.delete(process.env.REACT_APP_URL + '/user/' + user.id)
        .then(response => {
        console.log(response);
        })
        .catch(error => {
        console.error(error);
        throw error;
        });
    }