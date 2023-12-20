import ListManager from '~/server/managers/ListManager';

export default defineEventHandler((event) => { 
    const id = getRouterParam(event, 'id');
    if (!id) {
        return {
            error: 'No id provided'
        };
    }
    
    const list = ListManager.getList(id);
    if(!list) {
        return {
            error: 'List not found'
        };
    }

    return list;
});