import { existsSync, writeFileSync, readFileSync } from 'fs';

import ListManager from '~/server/managers/ListManager';
  
export default defineEventHandler(async (event) => { 
    const newList = ListManager.createEmptyList();
    const {title} = await readBody(event);
    newList.title = title;
    ListManager.afterUpdateEvent(newList.id);
    return newList;
});