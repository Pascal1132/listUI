<template>
    <div class="settings-item" :class="{oneRowInput}">
        <div class="row">
            <label :for="inputId">{{ label }}</label>
            <slot name="after-label"></slot>
            <input v-if="oneRowInput" class="settings-item__input" :id="inputId" :type="type" v-model="valueComputed" :placeholder="placeholder" :disabled="props.disabled" />
        </div>
        <div class="row" v-if="!oneRowInput">
            <slot v-if="props.useSlot" />
            <input class="settings-item__input" v-else :id="inputId" :type="type" v-model="valueComputed" :placeholder="placeholder" :disabled="props.disabled"  />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: String,
    type: {
        type: String,
        default: 'text'
    },
    placeholder: String,
    modelValue: {
        type: [String, Boolean],
        default: ''
    },
    useSlot: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    inputId: String
});

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (newValue) => {
    emit('update:modelValue', newValue);
});

const valueComputed = computed({
    get: () => props.modelValue,
    set: (newValue) => emit('update:modelValue', newValue)
});

const oneRowInput = computed(() => {
    return props.type === 'checkbox' || props.type === 'radio';
});

</script>

<style scope lang="scss">
/* Transpose the relevant SCSS here, make sure styles are applicable to the new structure of this item */
.settings-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;

    &.oneRowInput {
        flex-direction: row;
        .row {
            width: 100%;
        }
        label {
            margin-right: 1rem;
            width: 100%;
            text-align: left;
        }

        input {
            width: auto;
        }
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    label {
        font-weight: 500;
        color: var(--text-color);
    }

    .settings-item__input {
        width: 100%;
        padding: 0.5rem;
        border-radius: .2rem;
        border: none;
        background-color: var(--bg-secondary-color);
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