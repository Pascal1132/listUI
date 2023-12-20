<template>
    <div class="container">
        <button @click="newListClick">Nouvelle liste</button>
        <h2 v-if="recentLists.length > 0">Listes récentes</h2>
        <ul v-if="recentLists.length > 0" class="recent-lists">
            <li v-for="{id, title} in recentLists" :key="index" @click="goToList(id)">{{ title.length > 0 ? title : id }}</li>
        </ul>
    </div>
</template>
  

<script>
export default {
    data() {
        return {
            recentLists: []
        };
    },
    methods: {
        async newListClick() {
            const res = await useFetch('api/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const { data } = res;
            const id = data.value.id;
            this.$router.push(`/list/${id}`);
        },
        goToList(id) {
            this.$router.push(`/list/${id}`);
        },
        async getList (id){
            const value = await $fetch('/api/list/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (value.error) {
                return false;
            }

            return value;
        }
    },
    async mounted() {
        let recentLists = localStorage.getItem('recentLists');
        if (recentLists) {
            recentLists = JSON.parse(recentLists);
            let needSaveStorage = false;
            const recentListsObjects = [];
            // check for each list if the version is not false or null
            for (const id of recentLists) {
                const list = await this.getList(id);
                if (!list) {
                    recentLists = recentLists.filter((item) => item != id);
                    needSaveStorage = true;
                    continue;
                }
                recentListsObjects.push(list);
            }
            this.recentLists = recentListsObjects;

            if (needSaveStorage) {
                localStorage.setItem('recentLists', JSON.stringify(recentLists));
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.container {
    /* align at the vertical center */
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    /* full height */
    height: 100vh;
    /* full width */
    width: 100vw;
    /* background color */
    background-color: #272727;
    /* text color */
    color: #fff;
    /* font family */
    font-family: 'Poppins', sans-serif;

    button {
        /* button style */
        background-color: var(--primary-color);
        border: none;
        border-radius: 5px;
        padding: 1rem 2rem;
        color: var(--text-on-primary-color);
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        /* hover style */
        &:hover {
            background-color: var(--text-highlight-color);
            color: var(--bg-primary-color);
        }
    }

}

.recent-lists {
    /* list style */
    list-style: none;
    padding: 0;
    margin: 0;
    /* flexbox */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;

    max-height: 50vh;
    overflow-y: auto;

    /* li style */
    li {
        /* li style */
        padding: 10px 20px;
        background-color: var(--bg-secondary-color);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        /* hover style */
        &:hover {
            background-color: var(--text-highlight-color);
            color: var(--bg-primary-color);
        }
    }
}
</style>