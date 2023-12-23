<template>
    <div class="settings-container" @click.stop v-if="list">
        <div class="settings-header">
            <h3>Paramètres de la Liste</h3>
        </div>
        <div class="settings-body">
            <SettingFormItem label="Titre" type="text" v-model="listTitle" inputId="list-title"
                placeholder="Titre de la liste"/>
            <SettingFormItem label="Séparer la liste par tag" type="checkbox" v-model="separateByTag" inputId="list-by-tag" />
            <SettingFormItem label="Masquer les éléments sans tag" type="checkbox" v-model="hideDefaultTag" inputId="hide-default-category" :disabled="disableHideDefaultTag" />
            <SettingTagManager label="Tags" v-model="tags"/>
            <div class="settings-item">
                <label for="color-palette">Apparence</label>
                <div class="appearance-container">
                    <Appearance v-for="appearance in appearances" :key="appearance.id" :appearance="appearance"
                        @select="appearanceClicked(appearance)" :selected="selectedAppearance?.id == appearance?.id" />
                </div>
            </div>
        </div>
        <div class="settings-footer">
            <button @click="emits('delete-pressed')" class="delete">
                <Icon name="ic:delete" />
                Supprimer
            </button>
            <button class="save" @click="emits('close')">
                Fermer
                <Icon name="ic:close" />
            </button>
        </div>
    </div>
</template>
  
<script setup>

const props = defineProps({
    list: {
        type: Object,
    },
});
const emits = defineEmits(['list-changed', 'delete-pressed', 'close']);

const listTitle = ref(props.list?.title);
const selectedAppearance = ref(props.list?.appearance);
const tags = ref(props.list?.tags ?? []);
const separateByTag = ref(props.list?.separateByTag ?? false);
const hideDefaultTag = ref(props.list?.hideDefaultTag ?? false);

const appearanceClicked = (appearance) => {
    selectedAppearance.value = appearance;
    emits('list-changed', {
        ...props.list,
        appearance: selectedAppearance.value
    });
}

const disableHideDefaultTag = computed(() => {
    return !separateByTag.value || !tags.value || tags.value.length == 0;
})

const appearances = [
    ({
        id: null,
        name: 'Défaut',
        colors: {
            primary: '#294c8e',
            secondary: '#6c757d',
            success: '#28a745',
            info: '#17a2b8',
            warning: '#ffc107',
            danger: '#dc3545',
            light: '#f8f9fa',
            dark: '#343a40',
            text: '#eeeeee',
            textSecondary: '#d7d7d7',
            textOnPrimary: '#ffffff',
            textOnSecondary: '#ffffff',
            textHighlight: '#17a2b8',
            bgPrimary: '#272727',
            bgSecondary: '#4f4f4f',
        }
    }),
    ({
        id: 'pink',
        name: 'Rose',
        colors: {
            primary: '#e91e63',
            secondary: '#9c27b0',
            success: '#4caf50',
            info: '#00bcd4',
            warning: '#ff9800',
            danger: '#f44336',
            light: '#f8bbd0',
            dark: '#880e4f',
            text: '#ffeeee',
            textSecondary: '#d7d7d7',
            textOnPrimary: '#ffffff',
            textOnSecondary: '#ffffff',
            textHighlight: '#f0629A',
            bgPrimary: '#272727',
            bgSecondary: '#6f5555',
        }
    }),
    ({
        id: 'green',
        name: 'Vert',
        colors: {
            primary: '#4caf50',
            secondary: '#8bc34a',
            success: '#cddc39',
            info: '#00bcd4',
            warning: '#ff9800',
            danger: '#f44336',
            light: '#c5e1a5',
            dark: '#33691e',
            text: '#eeffee',
            textSecondary: '#d7d7d7',
            textOnPrimary: '#ffffff',
            textOnSecondary: '#ffffff',
            textHighlight: '#cddc39',
            bgPrimary: '#272727',
            bgSecondary: '#4f6f4f',
        }
    }),
    ({
        id: 'blue',
        name: 'Bleu',
        colors: {
            primary: '#2196f3',
            secondary: '#03a9f4',
            success: '#4caf50',
            info: '#00bcd4',
            warning: '#ff9800',
            danger: '#f44336',
            light: '#90caf9',
            dark: '#0d47a1',
            text: '#eeeeff',
            textSecondary: '#d7d7d7',
            textOnPrimary: '#ffffff',
            textOnSecondary: '#ffffff',
            textHighlight: '#03a9f4',
            bgPrimary: '#272727',
            bgSecondary: '#4f4f6f',
        }
    }),
];

watch(listTitle, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        emits('list-changed', {
            ...props.list,
            title: newValue
        });
    }
});

watch(selectedAppearance, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        emits('list-changed', {
            ...props.list,
            appearance: newValue
        });
    }
});

// watch tags deep
watch(tags, (newValue, oldValue) => {
    if (tags.value.length == 0) {
        hideDefaultTag.value = false;
    }
    emits('list-changed', {
        ...props.list,
        tags: newValue
    });
}, { deep: true });

watch(separateByTag, (newValue, oldValue) => {
    emits('list-changed', {
        ...props.list,
        separateByTag: newValue
    });
});

watch(hideDefaultTag, (newValue, oldValue) => {
    emits('list-changed', {
        ...props.list,
        hideDefaultTag: newValue
    });
});


</script>
  
<style scoped lang="scss">
.settings-container {
    display: flex;
    flex-direction: column;
    width: 80vw;
    max-width: 500px;
    max-height: 80vh;
    overflow: auto;
    justify-content: space-between;
    box-sizing: content-box;
    background-color: var(--bg-primary-color);
    padding: 1rem;
    border-radius: 5px;
    gap: 1rem;
    position: absolute;
    top: 10vh;


    .settings-header {
        display: flex;

        h3 {
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--text-on-primary-color);
            margin: 0;
        }
    }

    .settings-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .settings-footer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;

        .save,
        .delete {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid var(--bg-secondary-color);
            background-color: transparent;
            color: var(--text-on-secondary-color);
            cursor: pointer;
            transition: all 0.3s ease-in-out;

            &:hover {
                background-color: var(--success-color);
                border-color: var(--success-color);
                color: var(--text-on-success-color);
            }
        }

        .delete {
            &:hover {
                background-color: var(--danger-color);
                border-color: var(--danger-color);
                color: var(--text-on-danger-color);
            }
        }
    }

    .appearance-container {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        flex-wrap: wrap;
        height: 20vh;
        overflow-x: auto;
    }
}
</style>
  