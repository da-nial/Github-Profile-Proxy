(function iife() {
    /*
    this block adds a custom event listener for submit button, when the page gets loaded.
    */
    window.onload = async () => {
        const userForm = document.getElementById('userForm');
        userForm.addEventListener('submit', onSubmit);
    };

    /*
    this function is called when the submit button is pressed.
    it reads the username field value, and calls getUser function to render the requested user info.
    */
    async function onSubmit(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;

        await getUser(username);
    }

    /*
    this function gets a username as input,
     then firstly tries to get the corresponding user info from local storage
     if found it renders the info.
     otherwise creates an HTTP Get request and receives user info from Github API and renders it.
    */
    async function getUser(username) {
        // let userInfo = localStorage.getItem(username);
        let userInfo = JSON.parse(localStorage.getItem(username));

        if (userInfo !== null) {
            console.log(userInfo)
            renderMessage("The following information has been retrieved from the local storage of your browser.")
            renderUserInfo(userInfo)
        } else {
            const response = await fetch(`https://api.github.com/users/${username}`, {
                method: 'GET',
            });
            userInfo = await response.json()
            if (response.status === 200) {
                userInfo["favLanguage"] = await getUserFavLanguage(userInfo["repos_url"])
                localStorage.setItem(username, JSON.stringify(userInfo))
                clearNotif()
                renderUserInfo(userInfo)
            } else {
                renderError(`An error occurred! ${response.status}: ${userInfo.message}`)
            }
        }
    }

    /*
    this function gets a list of user repos via an HTTP Get request to Github api,
    sorts the repos based on the pushed_at property,
    filters the top 5 recent repos,
    and lastly returns the most frequent language in those repos.
    */
    async function getUserFavLanguage(userReposUrl) {
        const response = await fetch(userReposUrl, {
            method: 'GET',
        });

        if (response.status === 200) {
            const repos = await response.json()
            if (repos.length === 0) {
                return null
            }

            repos.sort(
                (a, b) => new Date(b["pushed_at"]) - new Date(a["pushed_at"])
            )

            let languages = {};
            for (let i = 0; i < Math.min(repos.length, 5); i++) {
                const repo_i_language = repos[i]["language"]
                if (repo_i_language !== null) {
                    languages[repo_i_language] = (languages[repo_i_language] || 0) + 1;
                }
            }
            const favLanguage = Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b);

            return favLanguage
        }
    }

    /*
    this function renders user info properties such as user avatar, their name,
     blog address, location, bio and favorite language.
    */
    function renderUserInfo(data) {
        const info = document.getElementById("info")
        info.innerHTML = "<div>\n" +
            "            <img src=\"./assets/img/avatar.png\" class=\"avatar\" id=\"avatar\"/>\n" +
            "        </div>\n" +
            "        <div>\n" +
            "            <h2 id=\"name\"> </h2>\n" +
            "            <h5 id=\"blog\"><a href=\"https://1995parham.me\"></a></h5>\n" +
            "            <h5 id=\"location\">  </h5>\n" +
            "            <h5 id=\"favLanguage\"> </h5>\n" +
            "        </div>\n" +
            "        <div>\n" +
            "            <h6 id=\"bio\"> </h6>\n" +
            "        </div>"

        const avatar = document.getElementById("avatar")
        const name = document.getElementById("name")
        const blogLink = document.getElementById("blog").getElementsByTagName("a")[0]
        const location = document.getElementById("location")
        const bio = document.getElementById("bio")
        const favLanguage = document.getElementById("favLanguage")

        avatar.src = data["avatar_url"]
        name.innerText = data["name"] !== null ? data["name"] : ""
        blogLink.href = data["blog"] !== null ? data["blog"] : ""
        blogLink.text = data["blog"] !== null ? data["blog"] : ""
        location.innerText = data["location"] !== null ? data["location"] : ""
        bio.innerText = data["bio"] !== null ? data["bio"] : ""
        favLanguage.innerText = data["favLanguage"] !== null ? "Most Used Language:" + data["favLanguage"] : ""
    }

    /*
    hides the notification box
    */
    function clearNotif() {
        const notif = document.getElementById("notif");
        notif.hidden = true;
    }

    /*
    renders a notification message, with the given argument as message.
    */
    function renderMessage(message) {
        const notif = document.getElementById("notif");
        notif.classList.remove("errorNotif")
        notif.classList.add("messageNotif")
        notif.hidden = false;
        notif.innerText = message;
    }

    /*
    renders an error message, with the given argument as error message.
    */
    function renderError(errorMsg) {
        const notif = document.getElementById("notif");
        notif.classList.remove("messageNotif")
        notif.classList.add("errorNotif")
        notif.hidden = false;
        notif.innerText = errorMsg;
    }
})()

