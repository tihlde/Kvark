import API from '../api';
import store from '../../store/store';
import * as UserActions from '../../store/actions/UserActions';

class UserService {
    
    static getUserData = async () => {
        // Check store
        const user = store.getState().user.userData;
        if(user.first_name != undefined) {
            return Promise.resolve(user);
        } else {
            // Fetch
            return API.getUserData().response()
                .then((data) => {
                    UserActions.setUserData(data)(store.dispatch);
                    return UserActions.getUserData(store.getState()).userData;
                });
        }
    };
}

export default UserService;