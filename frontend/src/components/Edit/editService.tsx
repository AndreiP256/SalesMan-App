import axios from 'axios';

export function visitsEdit(visit: any) {
    return axios.put(process.env.REACT_APP_URL + '/visit/' + visit.id, visit)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

export function clientsEdit(client: any) {
    return axios.put(process.env.REACT_APP_URL + '/clients/' + client.id, client)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

export function usersEdit(user: any) {
    return axios.put(process.env.REACT_APP_URL + '/user/' + user.id, user)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}