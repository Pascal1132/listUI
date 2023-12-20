import { existsSync, writeFileSync, readFileSync} from 'fs';

import listManager from '~/server/managers/ListManager';

export default defineEventHandler(async (event) => { 
    const id = getRouterParam(event, 'id');
    const itemId = getRouterParam(event, 'itemId');
    if (!id || !itemId) {
        return {
            error: 'No id provided'
        };
    }
    const newItem = await readBody(event);

    if (!newItem || !newItem.name) {
        return {
            error: 'No name provided'
        };
    }
    
    const list = listManager.updateItemFromList(id, itemId, newItem);
    if(!list) {
        return {
            error: 'List or item not found'
        };
    }

    listManager.afterUpdateEvent(id);

    return list;
});