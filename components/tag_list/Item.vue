<template>
    <div :class="classes"
        @pointerdown="(e) => startPress(e)"
        @pointerup="(e) => endPress(e)"
        @click="checkItem()"
        :style="{ fontSize }">
        <input class="selected-input-item-name" type="text" v-if="props.selected"  v-model="props.item.name" @blur="deselectItem" @keyup.enter="deselectItem" />
        <span v-if="!props.selected">{{ item.name }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['item-checked', 'item-selected']);
const classes = computed(() => {
    return {
        'list-item': true,
        'list-item--checked': props.item.checked,
        'list-item--selected': props.selected
    }
})

const checkItem = () => {
    if (props.selected) {
        return
    }
    props.item.checked = !props.item.checked;
    emits('item-checked', props.item)
}
const selectItem = (item) => {
    emits('item-selected', props.item)

    setTimeout(() => {
        document.querySelector('.selected-input-item-name').focus()
    }, 100)
}

const fontSize = computed(() => {
    // calculate font size based on item name length
    const nameLength = props.item.name.length;
    if (nameLength <= 20) {
        return '1rem';
    }
    if (nameLength <= 30) {
        return '.85rem';
    }
    return '0.75rem';
});

let pressTimer;

const startPress = (e) => {
    if (props.selected) {
        return
    }
    pressTimer = setTimeout(() => {
        selectItem()
        navigator.vibrate(30);
    }, 500)
}

const endPress = () => {
    clearTimeout(pressTimer)
}

const deselectItem = () => {
    emits('item-selected', null)
}
</script>

<style scoped lang="scss">
.list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--bg-secondary-color);
    cursor: pointer;
    transition: opacity 0.3s linear, background-color 0.3s linear, color 0.3s linear;

    &--checked {
        text-decoration: line-through;
        opacity: 0.5;
    }

    &--selected {
        background-color: var(--primary-color);
        color: var(--text-on-primary-color);
        padding: 0.25rem;
        width: 100%;


        input {
            background-color: var(--bg-primary-color);
            border: 1px solid var(--primary-color);
            color: var(--text-color);
            width: 100%;
            font-size: 0.8rem;
            padding: 0.5rem;
            transition: all 0.3s ease-in-out;

            &:focus {
                outline: none;
            }
        }
    }
}
</style>