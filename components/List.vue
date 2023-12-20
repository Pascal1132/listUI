<template>
    <div class="container" :class="{ itemSelected: selected != null }">
        <ul class="list" ref="list">
            <li v-for="item in formattedItems" :key="item.id" class="list-item" 
                @pointerdown="(e) => startPress(item, e)"
                @pointerup="(e) => endPress(item, e)"
                @click="checkItem(item)"
                :class="{ checked: item.checked, smallFont: item?.useSmallFont && selected != item, selected: selected == item }">
                <input v-if="selected?.id == item?.id" class="item-name" v-model="item.name" @keyup.enter="closeEditionAndSave" />
                <span v-else class="item-name" >{{ item.name }}</span>
            </li>
            <li class="list-item list-item-new smallFont" @click="newClicked">
                <input id="input-new"  placeholder="Entrez le nom de l'élément" v-if="newItem" class="item-name" v-model="newItem.name" @keyup.enter="addItem" />
                <span v-else class="item-name" >
                    <Icon name="mdi:plus" />
                    Ajouter un élément
                </span>
            </li>
        </ul>
        <div>
            <!--<li class="list-item-new">
                <input id="input-new" ref="input-new" type="text" placeholder="Nouvel élément..." v-model="newItem"
                    @keyup.enter="addItem" />
                <button class="add-button" @click="addItem">+</button>
            </li>-->
        </div>
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
    }
})

const emit = defineEmits(['add-item', 'item-checked'])

const selected = ref(null)

const formattedItems = computed(() => {
    const items = props.items.map((item) => {
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
    emit('item-updated', props.items[index])
    selected.value = null

}

const selectItem = (item) => {
    if (selected.value?.name == item.name) {
        selected.value = null;
        return
    }
    selected.value = item
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
    // emit an event to the parent component
    emit('add-item', { name: newItem.value.name})
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
    background-color: rgba(0, 0, 0, 0.5);
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

.itemSelected {
    .screen {
        opacity: 1;
        z-index: 10;

        .close-button {
            opacity: 1;
            transform: scale(1);
        }
    }

    .list-item-new {
        z-index: 11;
    }
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
}

    .list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        background-color: var(--bg-secondary-color);
        border-radius: 10px;
        transition: opacity 0.3s ease-in-out, transform 0.1s ease-in-out, width 0.3s ease-in-out;

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


            #input-new {
                text-align: center;
                &:focus {
                    outline: none;
                }
            }
        }
    }
</style>