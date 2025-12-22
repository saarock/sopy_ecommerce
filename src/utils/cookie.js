class Cookie {
    /**
     * 
     * @param {*} name 
     * @param {*} value 
     * @param {*} days 
     */
    static set(name, value, days) {
        let expires = "";
        if (days) {
            // Set the time to live for the cookie
            // The time is in milliseconds
            // 1 day = 24 hours = 24 * 60 minutes = 24 * 60 * 60 seconds = 24 * 60 * 60 * 1000 milliseconds
            // 1 day = 86400000 milliseconds
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ""}${expires}; path=/`;
    }


    static get(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

// This function will remove all cookies in the current domain
   static removeAll() {
    const cookies = document.cookie.split(";");
  
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0];
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
  };
  

}

export default Cookie;