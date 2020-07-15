/*****************************************************************************************************************
 * HAndles the Log in and Authetication Processes of the app
 * ***************************************************************************************************************
 */

mmm.v.authenticateUser = {

    setupUiByUserStatus: function () {
        const pageLocation = window.location.pathname;
        auth.onAuthStateChanged(function (user) {
            if (user) { // if anonymous or registered user
                if (user.isAnonymous) { // if user is anonymous
                    if (pageLocation === '/index.html' || pageLocation === '/') {
                        // show instructions to login
                        document.getElementById("auth-invitation").style.display = "block";
                    } else if (pageLocation === '/artists.html' ||
                        pageLocation === '/events.html' ||
                        pageLocation === '/persons.html') {
                        // redirect to login if anonymous
                        window.location.pathname = "/authenticateUser.html";
                    }
                    console.log('Navigating as anonymous');
                } else { // if user is registered
                    if (pageLocation === '/index.html' || pageLocation === '/') {
                        const menuItems = ["opt-create", "opt-update", "opt-delete"];
                        menuItems.forEach(rebuildMenu);

                        // build link menu options
                        function rebuildMenu(item) {
                            let menuItemEl = document.getElementById(item); // get menu item
                            menuItemEl.style.opacity = "1";
                            menuItemEl.removeChild(menuItemEl.firstElementChild); // remove 'span' element
                            menuItemEl.firstElementChild.style.display = "inline"; // show 'a' element
                        }

                        // enable button menu options
                        let menuClearEl = document.getElementById("tool-clear"); // get menu item
                        menuClearEl.style.opacity = "1";
                        menuClearEl.childNodes[0].nextElementSibling.disabled = false; // enable button
                        let menuGenerateEl = document.getElementById("tool-generate"); // get menu item
                        menuGenerateEl.style.opacity = "1";
                        menuGenerateEl.childNodes[0].nextElementSibling.disabled = false; // enable button
                    } else if (pageLocation === '/artist.html' ||
                        pageLocation === '/events.html' ||
                        pageLocation === '/persons.html') {
                        if (!user.emailVerified) {
                            alert('Check your email ' + user.email +
                                ' for instructions to verify this account before using this create/write operation');
                            window.location.pathname = "/index.html";
                        }
                    }
                    console.log('Navigating as: ' + user.email +
                        ' (verified Account? ' + user.emailVerified + ')');
                }
            } else { // if null: not registered nor anonymous user
                // authenticate user as anonymous
                auth.signInAnonymously();
            }
        });
    },
    setupLoginAndSignup: function () {
        const formEl = document.forms['User'],
            btnLogin = formEl.login,
            btnSignUp = formEl.signup;
        // manage sign up event
        btnSignUp.addEventListener("click",
            mmm.v.authenticateUser.handleSignUpButtonClickEvent);
        // manage log in event
        btnLogin.addEventListener("click",
            mmm.v.authenticateUser.handleLoginButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    },
    handleSignUpButtonClickEvent: async function () {
        const formEl = document.forms['User'],
            email = formEl.txtEmail.value,
            password = formEl.txtPassword.value;
        try {
            // upgrade user from anonymous to registered
            const newUserCredential = firebase.auth.EmailAuthProvider.credential(email, password);
            await auth.currentUser.linkWithCredential(newUserCredential); // link credentials to anonymous
            // send verification email
            const upgradedUser = auth.currentUser;
            await upgradedUser.sendEmailVerification();
            console.log('User ' + email + ' became registered');
            alert('Created account ' + email +
                '.\n\nCheck your email for instructions to verify this account.');
            window.location.pathname = "/index.html";
        } catch (e) {
            console.error(`${e.message}`);
        }
    },

    handleLoginButtonClickEvent: async function () {
        const formEl = document.forms['User'],
            email = formEl.txtEmail.value,
            password = formEl.txtPassword.value;
        try {
            const login = await auth.signInWithEmailAndPassword(email, password);
            if (login.user.emailVerified) {
                console.log('Granted access to user ' + email);
                window.location.pathname = "/index.html";
            } else {
                alert('Your email has not been verified\n\nCheck your email '
                    + email + ' and follow the instructions.');
            }
        } catch (e) {
            console.error(`${e.message}`);
        }
    },
    handleVerifyEmail: async function () {
        // get verification code from URL
        const urlParams = new URLSearchParams(location.search);
        const verificationCode = urlParams.get('oobCode');
        // initialize link element
        let a = document.getElementById('continue-link');
        try { // if email can be verified
            // apply the email verification code
            await auth.applyActionCode(verificationCode);
            // if success, handle HTML elements: message, continue instructions and continue link
            document.getElementById('verification-message').innerHTML =
                'Your email has been verified.';
            document.getElementById('continue-instruction').innerHTML =
                'You can now use all create/write operations on MuggefugMusicMaker.';
            let link = document.createTextNode("« Go to MuggefugMusicMaker");
            a.appendChild(link);
            a.href = "index.html";
        } catch (e) { // if email has been already verified
            // if error, handle HTML elements: message, continue instructions and continue link
            document.getElementById('verification-message').innerHTML =
                'Your validation link has already been used.';
            document.getElementById('continue-instruction').innerHTML =
                'You can now Log In on the MuggefukMusicMaker.';
            let link = document.createTextNode("« Go to the Log In page");
            a.appendChild(link);
            a.href = "authenticateUser.html";
            console.error(`${e.message}`);
        }
    }
}