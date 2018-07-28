import {IRequest} from './HttpHandler';

export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return new IRequest('GET', 'items/', false);
    },
    getNewsItem: (id) => {
        return new IRequest('GET', 'news/'.concat(id, '/'), false);
    },
};
