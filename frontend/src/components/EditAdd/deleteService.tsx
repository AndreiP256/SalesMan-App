import axios from 'axios';

export function visitsDelete(visit: any) {
    const token = localStorage.getItem('token');
    return axios.delete(process.env.REACT_APP_URL + '/visit/' + visit.id, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}

export function clientsDelete(client: any) {
    const token = localStorage.getItem('token');
    return axios.delete(process.env.REACT_APP_URL + '/clients/' + client.id, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}

export function usersDelete(user: any) {
    const token = localStorage.getItem('token');
    return axios.delete(process.env.REACT_APP_URL + '/user/' + user.id, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}