
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

    // remove tagId from all items that are not in the new tag list
    const oldTagIds = list.tags?.map(tag => tag.id) || [];
    const newTagIds = body.tags?.map((tag: { id: any; }) => tag.id) || [];
    const removedTagIds = oldTagIds.filter(id => !newTagIds.includes(id));
    list.items.forEach(item => {
        if (item.tagId && removedTagIds.includes(item.tagId)) {
            item.tagId = null;
        }
    });
    list.tags = body.tags;
    list.separateByTag = body.separateByTag;
    list.hideDefaultTag = body.hideDefaultTag;

    ListManager.afterUpdateEvent(id);

    return list;
});