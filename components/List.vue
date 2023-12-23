<script lang="js" setup>
import { ref, defineEmits } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        required: false
    },
    separateByTag: {
        type: Boolean,
        required: true,
        default: false
    },
    hideDefaultTag: {
        type: Boolean,
        required: true,
        default: false
    }
})

const emit = defineEmits(['add-item', 'item-checked', 'item-updated']);

const selectedItem = ref(null);

const groupByTags = computed(() => {
    if (!props.separateByTag) {
        return [{
            tag: null,
            items: props.items
        }]
    }
    const groups = {
        null: {
            tag: null,
            items: []
        }
    };

    for (const item of props.items) {
        const tagId = item.tagId ?? null;
        const tag = props.tags.find(t => t.id === tagId) ?? null;
        if (!groups[tagId]) {
            groups[tagId] = {
                tag,
                items: []
            }
        }
        groups[tagId].items.push(item);
    }

    for (const tag of props.tags) {
        if (!groups[tag.id]) {
            groups[tag.id] = {
                tag: tag,
                items: []
            }
        }
    }

    if (props.hideDefaultTag) {
        delete groups[null];
    }

    return Object.values(groups);

})

const onSelectedItem = (item) => {
    if (selectedItem.value && !item) {
        emit('item-updated', selectedItem.value);
        selectedItem.value = null;
        return;
    }
    selectedItem.value = item;
}
</script>

<template>
    <div class="container" >
        <TagList v-for="group in groupByTags" :key="group.tag" :tag="group.tag" :title="group.tag"
            :items="group?.items ?? []" @add-item="emit('add-item', $event)" @item-checked="emit('item-checked', $event)" @item-selected="onSelectedItem($event)" :selectedItem="selectedItem" />
    </div>
</template>

<style scoped lang="scss">

.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
}
</style>