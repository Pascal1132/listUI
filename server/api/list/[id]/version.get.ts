import ListManager from '~/server/managers/ListManager';

export default defineEventHandler((event) => { 
    const id = getRouterParam(event, 'id');
    if (!id) {
        return {
            error: 'No id provided'
        };
    }
    
    const version = ListManager.getVersionList(id);

    return version;
});