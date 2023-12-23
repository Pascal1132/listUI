<template>
    <div class="settings-container" @click.stop v-if="list">
        <div class="settings-header">
            <h3>Paramètres de la Liste</h3>
        </div>
        <div class="settings-body">
            <div class="settings-item">
                <label for="list-title">Titre</label>
                <input id="list-title" type="text" v-model="listTitle" placeholder="Titre de la liste" />
            </div>
            <div class="settings-item row">
                <label for="list-by-tag">Séparer la liste par tag</label>
                <input id="list-by-tag" type="checkbox" v-model="separateByTag" />
            </div>
            <!-- Liste des tags (title et color)-->
            <div class="settings-item">
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <label for="list-tags">Tags</label>
                    <div class="tag new"
                        @click="tags.push({ id: Math.random().toString(36).substring(7), title: '', color: '#000000' })">
                        <span>
                            Ajouter
                        </span>
                    </div>
                </div>
                <div class="tags-container">
                    <div class="tag" v-for="tag in tags" :key="tag.id" :class="{ selected: selectedTag == tag }">
                        <input class="color-input" :id="`ct-${tag.id}`" type="color" v-model="tag.color" />
                        <input type="text" class="tag-title" v-model="tag.title" @keyup.enter="selectedTag = null"
                            placeholder="Titre du tag" @focusout="selectedTag = null" :id="`tt-${tag.id}`" />
                        <label class="tag-title" v-show="selectedTag != tag" @click="selectedTag = tag"
                            :for="`tt-${tag.id}`">
                            {{ tag.title }}
                            <em v-if="tag.title.length == 0">Titre du tag</em>
                        </label>
                        <span class="tag-close">
                            <Icon name="ic:round-close" @click="tags.splice(tags.indexOf(tag), 1)" />
                        </span>
                    </div>
                    <div v-if="tags.length == 0">
                        <em>
                            Aucun tag
                        </em>
                    </div>

                </div>
            </div>
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
const selectedTag = ref(null);
const separateByTag = ref(props.list?.separateByTag ?? false);

const appearanceClicked = (appearance) => {
    selectedAppearance.value = appearance;
    emits('list-changed', {
        ...props.list,
        appearance: selectedAppearance.value
    });
}

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
    emits('list-changed', {
        ...props.list,
        tags: newValue
    });
}, { deep: true });

// watch separateByTag
watch(separateByTag, (newValue, oldValue) => {
    emits('list-changed', {
        ...props.list,
        separateByTag: newValue
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

    .settings-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 1rem;

        &.row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .tags-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 0.5rem;
            max-height: 20vh;
            overflow-x: auto;
            position: relative;
        }

        em {
            font-size: 0.75rem;
            color: var(--text-secondary-color);
        }

        .tag {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            align-items: center;
            padding: 0.25rem 0.5rem;
            height: 2.5rem;
            width: 90%;
            border-radius: .5rem;
            border: 1PX solid black;
            background-color: var(--bg-secondary-color);
            color: var(--text-on-secondary-color);
            transition: all 0.1s ease-in-out;



            &.new {
                cursor: pointer;
                font-size: .75rem;
                height: 2rem;
                width: 4rem;
                text-align: center;
                padding: 0 0.55rem;
                background-color: var(--bg-secondary-color);
                color: var(--bg-on-primary-color);
                position: sticky;

                &:active {
                    transform: scale(0.95);
                }
            }

            .tag-color {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                border: 1px solid black;
            }

            .tag-close {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                cursor: pointer;
                transition: all 0.1s ease-in-out;
                background-color: var(--bg-primary-color);
                padding: 0.25rem;
                border-radius: .1rem;

                &:hover {
                    transform: scale(1.1);
                }
            }

            .tag-title {
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
                border-radius: 5px;
                border: 1px solid transparent;
                width: 100%;
                background-color: var(--bg-secondary-color);
                color: var(--text-on-secondary-color);

                &:focus {
                    outline: none;
                }
            }

            .color-input {
                width: 2rem;
                height: 2rem;
                padding: 0;
                background-color: var(--bg-secondary-color);
                color: var(--text-on-secondary-color);
                cursor: pointer;
                border: none;
                transition: all 0.3s ease-in-out;

                &:hover {
                    transform: scale(1.1);
                }

                &:focus {
                    outline: none;
                }
            }

            &:not(.selected) {
                input.tag-title {
                    display: none;
                }
            }


            &.selected {
                input.tag-title {
                    border: 2px solid var(--text-highlight-color);
                    display: inline-block;
                }

                span.tag-title {
                    display: none;
                }
            }
        }

        label {

            text-align: left;
        }

        input {
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid black;
            background-color: var(--bg-secondary-color);
            color: var(--text-on-secondary-color);

            &:focus {
                outline: none;
                border-color: var(--text-highlight-color);
            }
        }

        button {
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid var(--bg-secondary-color);
            background-color: var(--bg-secondary-color);
            color: var(--text-on-secondary-color);
            cursor: pointer;
            transition: all 0.3s ease-in-out;

            &:hover {
                background-color: var(--error-color);
                border-color: var(--error-color);
                color: var(--text-on-error-color);
            }
        }
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
  