import { existsSync, writeFileSync, readFileSync} from 'fs';

import listManager from '~/server/managers/ListManager';

export default defineEventHandler(async (event) => { 
    const id = getRouterParam(event, 'id');
    if (!id) {
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
    
    const list = listManager.createItemForList(id, newItem.name, newItem?.tagId);
    if(!list) {
        return {
            error: 'List not found'
        };
    }

    listManager.afterUpdateEvent(id);

    return list;
});