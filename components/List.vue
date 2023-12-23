<template>
    <div class="container" :class="{ itemSelected: selected != null, newItem: newItem != null }">
        <ul class="list" ref="list" :class="{ separateByTag: separateByTag == true }">
            <li v-for="item in formattedItems" v-if="!separateByTag" :key="item.id" class="list-item"
                @pointerdown="(e) => startPress(item, e)" @pointerup="(e) => endPress(item, e)" @click="checkItem(item)"
                :class="{ checked: item.checked, smallFont: item?.useSmallFont && selected != item, selected: selected == item }">
                <input v-if="selected?.id == item?.id" class="item-name" v-model="item.name"
                    @keyup.enter="closeEditionAndSave" />
                <span v-else class="item-name">
                    {{ item.name }}
                    <span v-if="item.tagId" class="pellet" :style="{ '--tag-color': item.tagColor }"></span>
                </span>
            </li>
            <div v-if="separateByTag" v-for="tag in tags" :key="tag.id" :class="{hide:getItemsByTag(tag).length == 0}">
                <h2 >{{ tag.title }}</h2>
                <div class="list">
                    <li v-for="item in getItemsByTag(tag)" :key="item.id" class="list-item"
                        @pointerdown="(e) => startPress(item, e)" @pointerup="(e) => endPress(item, e)"
                        @click="checkItem(item)"
                        :class="{ checked: item.checked, smallFont: item?.useSmallFont && selected != item, selected: selected == item }">
                        <input v-if="selected?.id == item?.id" class="item-name" v-model="item.name"
                            @keyup.enter="closeEditionAndSave" />
                        <span v-else class="item-name">
                            {{ item.name }}
                            <span v-if="item.tagId" class="pellet" :style="{ '--tag-color': item.tagColor }"></span>
                        </span>
                    </li>
                </div>
            </div>
            <div v-if="separateByTag && getItemsByTag(null).length > 0">
                <h2>Défaut</h2>
                <div class="list">
                    <li v-for="item in getItemsByTag(null)" v-if="item?.tagId == null" :key="item.id" class="list-item"
                        @pointerdown="(e) => startPress(item, e)" @pointerup="(e) => endPress(item, e)"
                        @click="checkItem(item)"
                        :class="{ checked: item.checked, smallFont: item?.useSmallFont && selected != item, selected: selected == item }">
                        <input v-if="selected?.id == item?.id" class="item-name" v-model="item.name"
                            @keyup.enter="closeEditionAndSave" />
                        <span v-else class="item-name">
                            {{ item.name }}
                            <span v-if="item.tagId" class="pellet" :style="{ '--tag-color': item.tagColor }"></span>
                        </span>
                    </li>
                </div>
            </div>

            <li class="list-item list-item-new smallFont" @click="newClicked">
                <input id="input-new" placeholder="Entrez le nom de l'élément" v-if="newItem" class="item-name"
                    v-model="newItem.name" @keyup.enter="addItem" />
                <span v-else class="item-name">
                    <Icon name="mdi:plus" />
                    Ajouter un élément
                </span>

            </li>
            <li class="tags-container" @click.stop v-if="tags.length > 0" v-show="selected">
                <span v-for="tag in tags" :key="tag.id" class="tag"
                    @click.stop="selectedTag?.id == tag.id ? selectedTag = null : selectedTag = tag"
                    :class="{ active: selectedTag?.id == tag.id }" :style="{ '--tag-color': tag.color }">{{ tag.title
                    }}<span class="pellet" /></span>
            </li>
        </ul>
        <div class="screen" @click="closeEditionAndSave">
            <button class="close-button" @click="closeEditionAndSave">X</button>

        </div>
    </div>
</template>
        
        

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
        required: false,
        default: false
    }
})

const emit = defineEmits(['add-item', 'item-checked'])

const selected = ref(null)
const selectedTag = ref(null);

const getItemsByTag = (tag) => {
    return props.items.filter((item) => item.tagId == tag?.id)
}

const formattedItems = computed(() => {
    const items = props.items.map((item) => {
        item.tagColor = props.tags.find((tag) => tag.id == item.tagId)?.color;
        if (item.name.length > 10) {
            item.useSmallFont = true
            return item;
        }
        item.useSmallFont = false
        return item;
    })
    return items;
})

const newClicked = () => {
    if (selected.value?.id == 'new') {
        return
    }
    newItem.value = { id: 'new', name: '' };
    selected.value = newItem.value;

    console.log(selected.value)
    setTimeout(() => {
        // focus on the input
        document.querySelector('#input-new').focus()
    }, 100)
}

const checkItem = (item) => {
    if (selected.value) {
        return
    }

    item.checked = !item.checked
    // Emit an event to the parent component
    emit('item-checked', item)
}

const closeEditionAndSave = () => {
    if (selected.value?.id == 'new') {
        addItem()
        return
    }
    if (!selected.value) {
        return
    }

    // Emit an event to the parent component
    const index = props.items.findIndex((item) => item.id == selected.value.id)
    props.items[index].tagId = selectedTag.value?.id ? selectedTag.value.id : null;
    emit('item-updated', props.items[index])
    selected.value = null

}

const selectItem = (item) => {
    if (selected.value?.name == item.name) {
        selected.value = null;
        return
    }
    selected.value = item
    selectedTag.value = props.tags.find((tag) => tag.id == item.tagId);
    setTimeout(() => {
        // focus on the item name input
        document.querySelector('.selected .item-name').focus()
    }, 100)
}

const newItem = ref(null)

let pressTimer

const startPress = (item, e) => {
    if (item == selected.value) {
        return
    }
    pressTimer = setTimeout(() => {
        selectItem(item)
    }, 750) // Adjust the duration as needed
}

const endPress = () => {
    clearTimeout(pressTimer)
}

const addItem = () => {
    if (!newItem.value) {
        return
    }
    const tagId = selectedTag.value?.id ? selectedTag.value.id : null;

    // emit an event to the parent component
    emit('add-item', { name: newItem.value.name, tagId })
    newItem.value = null;
    selected.value = null;
}

</script>

<style lang="scss" scoped>
.screen {
    transition: all 0.3s ease-in-out;
    position: fixed;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: -1;

    .close-button {
        transition: all 0.3s ease-in-out;
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: transparent;
        border: none;
        color: var(--text-color);
        font-size: 2rem;
        cursor: pointer;
        opacity: 0;
        transform: scale(0.5);
    }
}
.hide {
    display: none;
}
.itemSelected {
    .screen {
        opacity: 1;
        z-index: 10;

        .close-button {
            opacity: 1;
            transform: scale(1);
        }
    }

    &.newItem {
        .list-item-new {
            z-index: 11;
        }
    }

    &:not(.newItem) {
        .list-item-new {
            z-index: -1;
            opacity: 0.2;
        }
    }
}

.tags-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    z-index: 11;
    background-color: var(--bg-primary-color);
    width: 100%;
    padding: 1rem 0;

    .tag {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: 600;
        background: var(--bg-secondary-color);
        display: flex;
        align-items: center;
        transition: all 0.3s ease-in-out;
        border: 1px solid black;

        &.active {
            transform: scale(1.1);
            box-shadow: 0 0 0 0.2rem var(--tag-color);
            filter: brightness(1.2);
        }

        .pellet {
            margin-bottom: 0;
        }

    }
}

.pellet {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    display: inline-flex;
    margin: 0 0.5rem;
    margin-bottom: 0.1rem;
    background-color: var(--tag-color);
}

.list {
    list-style: none;
    padding: 0 1rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    min-height: 2em;
    max-height: 50%;
    overflow-y: auto;

    &.separateByTag {
        flex-direction: column;
    }
}

.list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: var(--bg-secondary-color);
    border-radius: 10px;
    transition: opacity 0.3s ease-in-out, transform 0.1s ease-in-out, width 0.3s ease-in-out;
    animation: fade-slide 0.3s ease-in-out;

    &.checked {
        opacity: 0.5;
        color: var(--text-secondary-color);

        .item-name {
            text-decoration: line-through;
        }
    }

    &:active {
        transform: scale(0.95);
    }

    &.selected {
        transition: all 0.3s ease-in-out;
        z-index: 100;

        &:active {
            transform: scale(1);
        }
    }

    &.smallFont {
        .item-name {
            font-size: 1rem;
        }
    }

    .item-name {
        font-size: 1.2rem;
        max-width: 80vw;
        min-width: 2em;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: wrap;
        transition: all 0.3s ease-in-out;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: transparent;
        border: none;
        color: var(--text-color);

        &:focus {
            outline: none;
        }
    }

    .checked-icon {
        font-size: 1.6rem;
        color: var(--success-color);
        display: none;
    }

    &-new {
        background-color: transparent;
        border: 1px dashed var(--text-secondary-color);
        color: var(--text-on-primary-color);
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: none;

        #input-new {
            text-align: center;
            width: 100%;

            &:focus {
                outline: none;
            }
        }
    }
}

@keyframes fade-slide {
    from {
        opacity: 0;
        transform: translateY(-5%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>