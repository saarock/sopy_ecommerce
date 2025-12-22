class LocalStorage {

    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}


export default LocalStorage;
