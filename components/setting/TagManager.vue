

<script lang="js" setup>
const props = defineProps({
    label: String,
    modelValue: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

const tags = ref(props.modelValue)
const editTag = ref(null);
const tag = computed({
    get: () => tags.value,
    set: (newValue) => {
        tags.value = newValue
        emit('update:modelValue', newValue)
    }
})

const addTag = () => {
    document.querySelector('.tag-manager__tag.new').scrollIntoView({
        behavior: 'smooth'
    })
    tags.value.push({
        id: Math.random().toString(36).substring(7),
        title: ''
    });

    editMode(tags.value[tags.value.length - 1].id)

    

}

const removeTag = (id) => {
    tags.value = tags.value.filter(t => t.id !== id)
}

const editMode = (id) => {
    editTag.value = id;
    setTimeout(() => {
        document.querySelector('.tag-manager__tag input').focus()
    }, 100)
}

const computedTags = computed(() => {
    return tags.value.map(t => {
        t.isEditing = t.id === editTag.value
        return t;
    })
})

</script>


<template>
    <SettingFormItem :label="label" useSlot v-model="tag">
        <template #default>
            <div class="tag-manager">
                <div class="tag-manager__tags">
                    <div class="tag-manager__tag" v-for="tag in computedTags" :key="tag.id">

                        <span v-if="!tag.isEditing" @click="editMode(tag.id)">{{ tag.title }}
                            <em v-if="tag?.title?.length == 0"> Sans nom</em>
                        </span>

                        <input type="text" v-if="tag.isEditing" v-model="tag.title" @keyup.enter="editTag = null" />
                        <button @click="removeTag(tag.id)" v-if="tag.isEditing">
                            <Icon name="mdi:trash-can" />
                        </button>
                        <button @click="editMode(null)" v-if="tag.isEditing">
                            <Icon name="mdi:close" />
                        </button>
                        <button @click="editMode(tag.id)" v-if="!tag.isEditing">
                            <Icon name="mdi:pencil" />
                        </button>
                    </div>
                    <div class="tag-manager__tag new" @click="addTag">
                        Ajouter un tag
                        <Icon name="mdi:plus" />
                    </div>
                </div>
            </div>
        </template>
    </SettingFormItem>
</template>


<style scoped lang="scss">
.tag-manager {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
    width: 100%;

    &__tags {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    &__tag {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        width: 100%;
        background-color: var(--bg-secondary-color);

        padding: 0.5rem;
        min-width: 5rem;
        border-radius: 0.5rem;
        font-size: 1.2rem;
        height: 3rem;

        span {
            margin: 0.5rem;
            width: 100%;

            em {
                font-style: normal;
                color: var(--text-secondary-color);
                opacity: 0.5;
            }
        }

        input {
            background-color: var(--bg-primary-color);
            border: 1px solid var(--primary-color);
            color: var(--text-color);
            font-size: 1.2rem;
            padding: 0.5rem;
            width: 100%;
            margin: 0.5rem 0;
            transition: all 0.3s ease-in-out;

            &:focus {
                outline: none;
            }


        }

        &.new {
            border: 2px dashed var(--text-secondary-color);
            min-width: 3rem;
            height: 3rem;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            transition: all 0.3s ease-in-out;
            padding: 0;
            background-color: transparent;

            &:active {
                transform: scale(0.9);
            }
        }

        &>button {
            background-color: var(--bg-primary-color);
            border: none;
            height: 2rem;
            width: 2rem;
            border-radius: .1rem;
            margin: 0;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--text-secondary-color);
        }
    }
}
</style>
