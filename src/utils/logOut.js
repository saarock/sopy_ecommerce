import Cookie from "./cookie";
import LocalStorage from "./localStorage";

function logoutFromClientSide() {
    LocalStorage.clear();
    Cookie.removeAll();
    window.location.href = "/"
}

export default logoutFromClientSide;