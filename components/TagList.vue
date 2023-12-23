<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    tag: {
        type: Object,
        required: false
    },
    selectedItem: {
        type: Object,
        required: false
    }
});

const newItem = ref(null);

const emits = defineEmits(['add-item', 'item-checked', 'item-selected']);

const enterAddMode = () => {
    newItem.value = {
        name: ''
    }

    setTimeout(() => {
        document.querySelector('.new-item-input').focus();
    }, 100);
}

const addItem = () => {
    if (!newItem.value.name) {
        return;
    }
    newItem.value.tagId = props.tag?.id ?? null;

    emits('add-item', newItem.value);
    newItem.value = null;
}

const exitAddMode = () => {
    if (!newItem.value.name) {
        newItem.value = null;
    } else {
        setTimeout(() => {
            addItem();
        }, 100);
    }
}

const onItemChecked = (item) => {
    emits('item-checked', item);
}

const onItemSelected = (item) => {
    emits('item-selected', item);
}

</script>

<template>
    <div class="tag-list">
        <h3 v-if="tag?.title" class="tag-list-title">{{ tag.title }}</h3>
        <div class="list">
            <TagListItem v-for="item in items" :selected="item?.id == selectedItem?.id" :key="item.id" :item="item" @item-checked="onItemChecked" @item-selected="onItemSelected"/>

            <em v-if="items.length == 0">
                Aucun élément
            </em>
        </div>
        <div class="new-item" @click="enterAddMode" :class="{ 'new-item--active': newItem }">
            <input placeholder="Entrez le nom de l'élément" v-if="newItem" class="new-item-input" v-model="newItem.name"
                @keydown.enter="addItem" @blur="exitAddMode"/>
            <span v-else class="new-item-placeholder">
                <Icon name="mdi:plus" />
                Ajouter un élément
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    background-color:rgba(0,0,0,0.2);
    padding: 1rem;
    border-radius: 5px;
}

.tag-list {
    padding: 0 1rem;

    &-title {
        font-size: 1.5rem;
        color: var(--text-color);
        text-align: left;
        margin-bottom: 1rem;
    }
}

.new-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    cursor: pointer;
    width: 100%;
    border: 1px dashed var(--primary-color);
    border-radius: 5px;
    height: 2.5rem;
    background-color: rgba(0,0,0,0.2);

    &.new-item--active {
        border-style: solid;
        border-color: var(--primary-color);
    }

    .new-item-input {
        width: 100%;
        padding: 0.5rem;
        height: 100%;
        margin: 0;
        border: none;
        text-align: center;
        background-color: transparent;
        color: var(--text-color);
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s ease-in-out;

        &:focus {
            outline: none;
        }
    }
}
</style>