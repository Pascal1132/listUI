<template>
    <div :style="style" v-if="props.appearance">
        <div class="container" :class="{ selected }" @click="emits('select')">
            <div class="appearance-headers">
                <span class="appearance-name">{{ props.appearance.name }}</span>
                <div class="fake-headers-btn-container">
                    <div class="fake-headers-btn"></div>
                    <div class="fake-headers-btn"></div>
                </div>
            </div>
            <div class="fake-list-container">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>

            </div>
            <div class="fake-input-container">
            </div>
        </div>
    </div>
</template>

<script lang="js" setup>
const props = defineProps({
    appearance: {
        type: Object,
    },
    selected: {
        type: Boolean,
        default: false
    }
})

//watch on props.selected
watch(() => props.selected);
const emits = defineEmits(['select'])

const style = computed(() => {
    return {
        '--primary-color': props.appearance.colors.primary,
        '--secondary-color': props.appearance.colors.secondary,
        '--success-color': props.appearance.colors.success,
        '--info-color': props.appearance.colors.info,
        '--warning-color': props.appearance.colors.warning,
        '--danger-color': props.appearance.colors.danger,
        '--light-color': props.appearance.colors.light,
        '--dark-color': props.appearance.colors.dark,
        '--text-color': props.appearance.colors.text,
        '--text-highlight-color': props.appearance.colors.textHighlight,
        '--text-secondary-color': props.appearance.colors.textSecondary,
        '--text-on-primary-color': props.appearance.colors.textOnPrimary,
        '--text-on-secondary-color': props.appearance.colors.textOnSecondary,
        '--bg-primary-color': props.appearance.colors.bgPrimary,
        '--bg-secondary-color': props.appearance.colors.bgSecondary,

    }
})

</script>

<style scoped lang="scss">
.container {
    width: 5.5rem;
    height: 7rem;
    background-color: var(--bg-primary-color);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 1px solid black;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    border-radius: 5px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border 0.2s ease-in-out;

    &:hover,
    &.selected {
        border: 1px solid var(--text-highlight-color);
        box-shadow: 0 0 10px var(--text-highlight-color);
    }

    &.selected {
        transform: scale(0.95);
    }


    .appearance-headers {
        width: 100%;
        display: flex;
        flex-direction: row;
        margin-top: 0.2rem;
        margin-left: 0.2rem;
        align-items: center;
        justify-content: space-between;

        .appearance-name {
            font-size: 0.8rem;
            background-image: linear-gradient(to left, var(--text-color), var(--text-highlight-color));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .fake-headers-btn-container {
            width: 1.5rem;
            height: 0.5rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 0.2rem;

            .fake-headers-btn {
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 1px;
                background-color: var(--bg-secondary-color);
            }
        }
    }

    .fake-list-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        div {
            width: 1rem;
            height: 0.5rem;
            border-radius: 3px;
            background-color: var(--bg-secondary-color);
            margin: 0.2rem;

            &:nth-child(1) {
                width: 2rem;
            }

            &:nth-child(2) {
                width: 1.2rem;
            }

            &:nth-child(3) {
                width: 1.5rem;
            }

            &:nth-child(4) {
                width: 1.8rem;
            }

            &:nth-child(5) {
                width: 1.2rem;
            }
        }
    }

    .fake-input-container {
        background-color: transparent;
        border: 0.5px dashed var(--text-secondary-color);
        color: var(--text-on-primary-color);
        height: 1rem;
        margin-top: 2px;
        border-radius: 2px;
        width: 95%;
    }
}
</style>