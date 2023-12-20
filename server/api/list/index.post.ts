import { existsSync, writeFileSync, readFileSync } from 'fs';

import ListManager from '~/server/managers/ListManager';
  
export default defineEventHandler((event) => { 
    const newId = ListManager.createEmptyList();
    ListManager.afterUpdateEvent(newId);
    return {
        id: newId,
    };
});