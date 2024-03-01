import axios from 'axios';

export function visitsEdit(visit: any) {
    const token = localStorage.getItem('token');
    return axios.put(process.env.REACT_APP_URL + '/visit/' + visit.id, visit, {
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

export function clientsEdit(client: any) {
    const token = localStorage.getItem('token');
    const { id, ...clientWithoutId } = client;
    return axios.put(process.env.REACT_APP_URL + '/clients/' + id, clientWithoutId, {
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

export function usersEdit(user: any) {
    const token = localStorage.getItem('token');
    return axios.put(process.env.REACT_APP_URL + '/user/' + user.id, user, {
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
