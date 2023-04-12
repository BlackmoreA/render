"use strict";
(function () {
    function Start() {
        console.log("App Started!");
        let page_id = $("body")[0].getAttribute("id");
        switch (page_id) {
            case "home":
                DisplayHomePage();
                break;
            case "about":
                DisplayAboutPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "contact":
                DisplayContactsPage();
                break;
            case "contact-list":
                DisplayContactListPage();
                break;
            case "products":
                DisplayProductsPage();
                break;
            case "register":
                DisplayRegisterPage();
            case "login":
                DisplayLoginPage();
                break;
            case "add":
                DisplayEditPage();
            case "edit":
                DisplayEditPage();
            case "404":
                Display404Page();
                break;
        }
    }
    window.addEventListener("load", Start);
    function AuthGuard() {
        let protected_routes = ["contact-list", "edit"];
        if (protected_routes.indexOf(location.pathname) > -1) {
            if (!sessionStorage.getItem("user")) {
                location.href = "/login";
            }
        }
    }
    function Display404Page() {
        console.log("Displaying 404 Page");
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayHomePage() {
        console.log("Display Home Called");
        $("#ProductsBtn").on("click", () => { location.href = "/products"; });
        $("#ServicesBtn").on("click", () => { location.href = "/services"; });
        $("#AboutUsBtn").on("click", () => { location.href = "/about"; });
        $("#ContactUsBtn").on("click", () => { location.href = "/contact"; });
    }
    function DisplayProductsPage() {
        console.log("Display Products Called");
    }
    function DisplayServicesPage() {
        console.log("Display Services Page Called");
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-Z][a-z]+))*$/, "Please enter a valid first and last name (ex. Mr. Peter Parker)");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid phone number (ex. 555 555-5555");
        ValidateField("#email", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address (ex. example@email.com");
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let errorMessage = $("#errorMessage");
        errorMessage.hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                errorMessage.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                errorMessage.removeAttr("class").hide();
            }
        });
    }
    function DisplayContactsPage() {
        console.log("Display Contacts Called");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () { location.href = "/contact-list"; });
        ContactFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function (event) {
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayAboutPage() {
        console.log("Display About us page Called");
    }
    function DisplayContactListPage() {
        console.log("Display Contact List page Called");
        $("a.delete").on("click", function (event) {
            if (!confirm("Delete Contact? Please confirm: ")) {
                event.preventDefault();
                location.href = "/contact-list";
            }
        });
    }
    function DisplayEditPage() {
        console.log("Display Edit Page called");
        ContactFormValidation();
    }
    function DisplayRegisterPage() {
        console.log("Display Register page Called");
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html('<a id="logout" class="nav-link" href="#"' +
                '<i class="fa-solid fa-sign-out-alt"></i> Logout</a>');
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            location.href = "/home";
        });
    }
    function DisplayLoginPage() {
        console.log("Display Login page Called");
    }
})();
//# sourceMappingURL=app.js.map