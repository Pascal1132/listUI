
import ListManager from '~/server/managers/ListManager';
  
export default defineEventHandler(async (event) => { 
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
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

    list.title = body.title;
    list.appearance = body.appearance;

    ListManager.afterUpdateEvent(id);

    return list;
});