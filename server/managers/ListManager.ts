type Appearance = {
    colors: any;
    id: string;
    name: string;
}
type Tag = {
    id: string;
    title: string;
    color: string;
}
type List = {
    hideDefaultTag: boolean | null | undefined;
    separateByTag: boolean | null | undefined;
    tags: Tag[] | null;
    appearance: Appearance | null;
    id: string;
    items: ListItem[];
    version?: number;
    title?: string;
}

type ListItem = {
    name: string;
    id: string;
    checked: boolean;
    tagId?: string | null | undefined;
}

const FILES_PATH = './data/lists/';

const GROUPES_DU_NOMS = [
    "Le chien ",
    "Le chat ",
    "Le poisson rouge ",
    "Le hamster ",
    "Le lapin ",
    "Le cochon d'inde ",
    "Le serpent ",
    "Le perroquet ",
    "Le poney ",
    "Le cheval ",
    "Le mouton ",
    "Le cochon ",
    "Le canard ",
    "Le poulet ",
    "Le coq ",
    "Le pigeon ",
    "Le rat ",
    "Le loup ",
    "Le renard ",
    "Le tigre ",
    "Le lion ",
    "Le crocodile ",
    "Le singe ",
    "Le gorille ",
    "Le panda ",
    "Le koala ",
    "Le kangourou ",
    "Le lama ",
    "Le renne ",
    "Le serpent ",
    "Le requin ",
    "Le dauphin ",
    "Le poisson ",
    "Le crabe ",
    "Le homard ",
    "La crevette ",
    "La tortue ",
    "Le moustique ",
    "Le mille-pattes ",
    "Le papillon ",
    "Le ver de terre ",
];

const GROUPES_DU_VERBE = [
    "mange ",
    "boit ",
    "dévore ",
    "déchiquete ",
    "joue avec ",
    "mord ",
    "détruit ",
    "grignote ",
    "dépèce ",
    "décapite ",
    "dépouille ",
    "chasse ",
    "fouette ",
    "étripe ",
    "déchire ",
    "frappe ",
    "défonce ",
    "crève ",
    "écrase ",
];

const GROUPES_DU_COMPLEMENT = [
    "un os",
    "un morceau de viande",
    "un morceau de fromage",
    "un morceau de pain",
    "une souris",
    "un oiseau",
    "un poisson",
    "un iphone",
    "une tablette",
    "un ordinateur",
    "un livre",
    "un journal",
    "un magazine",
    "un journal",
    "une télévision",
    "une voiture",
    "une moto",
    "un vélo",
    "un skateboard",
    "un roller"
];

const LIEU_COMPLEMENT = [
    " dans la cuisine",
    " dans le salon",
    " dans le jardin",
    " dans la chambre",
    " dans la salle de bain",
    " dans le garage",
    " dans la cave",
    " dans le grenier",
    " dans la forêt",
    " dans la jungle",
    " dans la savane",
    " à la montagne",
    " à la mer",
    " dans la piscine",
    " dans la rivière",
    " dans le lac",
    " dans l'étang",
    " dans la mare",
    " dans le désert",
    " dans la ville",
    " dans le village",
    " dans la campagne",
    " dans le pré",
    " dans le champ",
    " à la ferme",
    " dans la grange",
    " dans l'étable",
    " dans la bergerie",
    " dans la porcherie",
    " dans le poulailler",
    " au chenil",
    " dans la niche",
    " dans la cage",
    " au zoo",
    " au cirque",
    " au parc",
    " sur la rue",
    " dans la maison",
    " dans l'appartement",
    " dans la voiture",
];

const getCurrentTimeStamp = () => {
    return new Date().getTime();
}
import fs from 'fs';
class ListManager {
    private lists: List[];

    constructor() {
        this.lists = [];
        this.loadListsFromFiles();
    }
    loadListsFromFiles() {
        const files = fs.readdirSync(FILES_PATH);
        this.lists = files.map((file) => {
            const list = JSON.parse(fs.readFileSync(FILES_PATH + file, 'utf8'));
            return list;
        });
    }

    async saveListToFile(id: string) {
        const list = this.getList(id);
        if (!list) {
            return false;
        }
        const fileName = FILES_PATH + id + '.json';
        await fs.promises.writeFile(fileName, JSON.stringify(list), 'utf8');
        return true;
    }

    async removeListFromFile(id: string) {
        const fileName = FILES_PATH + id + '.json';
        await fs.promises.unlink(fileName);
        return true;
    }


    addList(list: List) {
        this.lists.push(list);
    }
    getList(id: string) {
        return this.lists.find((list) => list.id === id);
    }
    removeList(id: string) {
        this.lists = this.lists.filter((list) => list.id !== id);
        this.removeListFromFile(id);
    }
    getLists() {
        return this.lists;
    }
    _createId() {
        let id = this._generateId();
        while (this.lists.find((list) => list.id === id)) {
            id = this._generateId();
        }
        return id;
    }

    _generateId() {
        // creer une phrase avec un groupe du nom, un groupe du verbe et un groupe du complement
        const nom = GROUPES_DU_NOMS[Math.floor(Math.random() * GROUPES_DU_NOMS.length)];
        const verbe = GROUPES_DU_VERBE[Math.floor(Math.random() * GROUPES_DU_VERBE.length)];
        const complement = GROUPES_DU_COMPLEMENT[Math.floor(Math.random() * GROUPES_DU_COMPLEMENT.length)];
        const lieu = LIEU_COMPLEMENT[Math.floor(Math.random() * LIEU_COMPLEMENT.length)];
        // transformer la phrase en slug pour url
        let slug = nom + verbe + complement + lieu;
        slug = slug.toLowerCase().replace(/ /g, '-').replace(/é/g, 'e').replace(/è/g, 'e').replace(/à/g, 'a').replace(/ç/g, 'c').replace(/ù/g, 'u').replace(/ô/g, 'o').replace(/î/g, 'i').replace(/â/g, 'a').replace(/ê/g, 'e').replace(/û/g, 'u').replace(/ë/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ÿ/g, 'y').replace(/æ/g, 'ae').replace(/œ/g, 'oe').replace(/ /g, '-').replace(/'/g, '-');
        // ajouter un nombre aleatoire a la fin du slug pour eviter les doublons
        slug += '-' + Math.floor(Math.random() * 1000);
        return slug;
    }

    _generateItemId() {
        return "i-" + Math.floor(Math.random() * 1000000000);
    }

    createEmptyList() {
        const id = this._createId();
        const newList: List = {
            hideDefaultTag: false,
            separateByTag: true,
            id,
            items: [],
            tags: null,
            version: getCurrentTimeStamp(),
            title: '',
            appearance: null
        };

        this.addList(newList);
        return newList;
    }

    addItemToList(id: string, item: ListItem) {
        const list = this.getList(id);
        if (!list) {
            return false;
        }
        list.items.push(item);
        return list;
    }

    afterUpdateEvent(id: string) {
        const list = this.getList(id);
        if (!list) {
            return false;
        }
        list.version = getCurrentTimeStamp();
        this.saveListToFile(id);
        return true;
    }

    getVersionList(id: string) {
        const list = this.getList(id);
        if (!list) {
            throw new Error('List not found');
        }
        return list.version;
    }

    createItemForList(id: string, itemName: string, tagId?: string | null | undefined) {
        const newItem = {
            name: itemName,
            id: this._generateItemId(),
            checked: false,
            tagId
        };
        return this.addItemToList(id, newItem);
    }

    removeItemFromList(id: string, itemId: string) {
        const list = this.getList(id);
        if (!list) {
            return false;
        }
        list.items = list.items.filter((item) => item.id !== itemId);
        return list;
    }

    updateItemFromList(id: string, itemId: string, newItem: ListItem) {
        const list = this.getList(id);
        if (!list) {
            return false;
        }
        const item = list.items.find((item) => item.id === itemId);
        if (!item) {
            return false;
        }
        item.name = newItem.name;
        item.checked = newItem.checked;
        item.tagId = newItem.tagId;
        return list;
    }
}

const listManager = new ListManager();

export default listManager;