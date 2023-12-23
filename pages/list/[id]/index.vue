<template>
    <div class="container" :style="style">
        <div>
            <div class="headers">
                <h3 @click="goToHome">{{(res?.title || res?.id)}}</h3>
                <div class="header-icons">
                    <div @click="onClearCheckedItems" class="header-icon" :class="{hidden:!(res?.items?.some(item => item.checked))}">
                        <Icon name="ic:round-delete" />
                    </div>
                    <div @click="showQrCode = true" class="header-icon">
                        <Icon name="ic:round-share" />
                    </div>
                    <div @click="showSettings = true" class="header-icon">
                        <Icon name="ic:round-settings" />
                    </div>
                </div>
            </div>
            <List v-if="res?.items?.length >= 0" :items="res?.items" @add-item="onAddItem" @item-checked="onItemUpdated" :separate-by-tag="res?.separateByTag ?? false"
                @item-updated="onItemUpdated" :tags="res?.tags ?? []"
                :hide-default-tag="res?.hideDefaultTag ?? false"
                ></List>
        </div>
        <div class="screen" @click="showQrCode = false" :class="{ active: showQrCode }">
            <ClientOnly>
                <qrcode :value="url" :size="300" level="H" />
            </ClientOnly>
            <div class="url-input-container" @click.stop>
                <div class="url-input">
                    <input type="text" :value="url" readonly />
                    <button class="copy-to-clipboard" @click="copyToClipboard(url)" v-if="window?.isSecureContext">
                        <Icon name="mdi:content-copy" />
                    </button>
                </div>
            </div>
        </div>
        <div class="screen" @click="onSettingsClosed" :class="{ active: showSettings }">
            <ClientOnly>
                <Settings :list="res" @list-changed="onListChanged" @delete-pressed="onDeleteListPressed" @close="onSettingsClosed" />
            </ClientOnly>
        </div>
    </div>
</template>
  
<script setup>
const id = useRoute().params.id;
const router = useRouter();
const showQrCode = ref(false);
const showSettings = ref(false);

const { data: res, pending, error, refresh } = useFetch('/api/list/' + id);

const onSettingsClosed = () => {
    showSettings.value = false;

    // on update la liste
    onListUpdated(res.value);
}

const onDeleteListPressed = async () => {
    const res = await useFetch('/api/list/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    router.push('/');
}

const onListChanged = (list) => {
    res.value = list;
}

const style = computed(() => {
    if (!res?.value?.appearance) return {}
    return {
        '--primary-color': res.value.appearance.colors.primary,
        '--secondary-color': res.value.appearance.colors.secondary,
        '--success-color': res.value.appearance.colors.success,
        '--info-color': res.value.appearance.colors.info,
        '--warning-color': res.value.appearance.colors.warning,
        '--danger-color': res.value.appearance.colors.danger,
        '--light-color': res.value.appearance.colors.light,
        '--dark-color': res.value.appearance.colors.dark,
        '--text-color': res.value.appearance.colors.text,
        '--text-highlight-color': res.value.appearance.colors.textHighlight,
        '--text-secondary-color': res.value.appearance.colors.textSecondary,
        '--text-on-primary-color': res.value.appearance.colors.textOnPrimary,
        '--text-on-secondary-color': res.value.appearance.colors.textOnSecondary,
        '--bg-primary-color': res.value.appearance.colors.bgPrimary,
        '--bg-secondary-color': res.value.appearance.colors.bgSecondary,

    }
})

const onClearCheckedItems = async () => {
    const res = await useFetch('/api/list/' + id + '/clean', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    refresh();
}

const onAddItem = async (item) => {
    const res = await useFetch('/api/list/' + id + '/item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    refresh();
}

const copyToClipboard = (text) => {
    if (window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

const checkVersionList = async () => {
    const { data: { value } } = await useFetch('/api/list/' + id + '/version', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (value != res.value.version) {
        refresh();
    }
}

const url = computed(() => {
    if (typeof window === 'undefined') return ''
    return window?.location?.href || ''
});

const goToHome = () => {
    router.push('/');
}

const onItemUpdated = async (item) => {
    const id = useRoute().params.id;

    const res = await useFetch('/api/list/' + id + '/item/' + item.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });

    refresh();
}

const onListUpdated = async (list) => {
    const id = useRoute().params.id;

    const res = await useFetch('/api/list/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(list)
    });

    refresh();
}

let loopCheck = null;

onMounted(() => {
    if (res?.value?.error == 'List not found') {
        router.push('/');
    }

    // add to storage
    const recentLists = JSON.parse(localStorage.getItem('recentLists')) || [];

    if (!recentLists.includes(id)) {
        recentLists.push(id);
        localStorage.setItem('recentLists', JSON.stringify(recentLists));
    }

    loopCheck = setInterval(checkVersionList, 5000);
});

onUnmounted(() => {
    clearInterval(loopCheck);
});
</script>

<style lang="scss" scoped>
.headers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    gap: 1rem;

    .header-icons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .5rem;
    }

    .header-icon {
        font-size: 1.4rem;
        line-height: 1;
        color: var(--text-highlight-color);
        background-color: var(--bg-secondary-color);
        padding: 7px;
        border-radius: 2px;

        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
            transform: scale(1.2);
            background-color: var(--text-highlight-color);
            color: var(--text-on-primary-color);
        }

        &.hidden {
            opacity: 0;
            pointer-events: none;
        }
    }
}



.screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    opacity: 0;
    pointer-events: none;

    transition: all 0.3s ease-in-out;

    &.active {
        opacity: 1;
        pointer-events: all;
    }

    .url-input-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;

        .url-input {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;

            input {
                padding: 10px;
                border-radius: 5px;
                border: 1px solid var(--primary-color);
                width: 300px;
                font-size: 1rem;
                font-family: inherit;
                color: inherit;
                background-color: var(--background-color);

                &:focus {
                    outline: none;
                    border-color: var(--primary-color);
                }
            }

            .copy-to-clipboard {
                font-size: 1.2rem;
                border-radius: 50rem;
                line-height: 1;
                background-color: var(--primary-color);
                width: 40px;
                height: 40px;
                border: none;
                color: var(--text-color);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s ease-in-out;

                &:hover {
                    transform: scale(1.2);
                }
            }
        }
    }
}
</style>
  
  

