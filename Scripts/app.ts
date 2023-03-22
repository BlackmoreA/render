"use strict";

//IIFE - Immediately Invoke Function Expression
//AKA - Anonymous Self - Executing Function
// AjaxRequest("GET", "../Views/Components/header.html", LoadHeader);

(function(){
    function Start()
    {
        console.log("App Started!");

        LoadHeader();

        LoadLink("home");

        LoadFooter();
    }
    window.addEventListener("load", Start)



    /**
     * Returns a function for the activeLink to display
     * @param {string} activeLink
     * @returns {function}
     */
    function ActiveLinkCallback() :Function {
        switch(router.ActiveLink)
        {
            case "home" : return DisplayHomePage;
            case "about" : return DisplayAboutPage;
            case "services" : return DisplayServicesPage;
            case "contact" : return DisplayContactsPage;
            case "contact-list" : return DisplayContactListPage;
            case "products" : return DisplayProductsPage;
            case "register" : return DisplayRegisterPage
            case "login" : return DisplayLoginPage;
            case "edit" : return DisplayEditPage;
            case "404" : return Display404Page;
            default : console.error("Error: Callback does not exist " + router.ActiveLink);
                      return new Function();
            break;
        }
    }

    function AuthGuard():void {
        let protected_routes = ["contact-list"];

        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
            }
        }
    }

    function LoadHeader() :void {
        $.get("/Views/Components/header.html", function(html_data) {
            $("header").html(html_data);

            AddNavigationEvents();
            CheckLogin();
        });
    }

    function CapitalizeFirstCharacter(str:string) :string { return str.charAt(0).toUpperCase() + str.slice(1); }

    function LoadContent() :void {
        let page : string = router.ActiveLink;
        let callback : Function = ActiveLinkCallback();

        $.get(`./Views/Content/${page}.html`, function(html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }

    function LoadFooter() :void {
        $.get("./Views/Components/footer.html", function(html_data) {
            $("footer").html(html_data);
        });
    }

    function LoadLink(link:string, data:string = ""):void {
        router.ActiveLink = link;

        AuthGuard();

        router.LinkData = data;

        history.pushState({}, "", router.ActiveLink);

        document.title = CapitalizeFirstCharacter(router.ActiveLink);

        $("ul>li>a").each(function() {
           $(this).removeClass("active");
        });

        $(`il>a:contains(${document.title})`).addClass("active");

        LoadContent();
    }

    function AddNavigationEvents() {
        let mainButt = $("#webd");
        let navLinks = $("ul>li>a");

        navLinks.off("click");
        navLinks.off("mouseover");

        mainButt.off("click");
        mainButt.off("mouseover");

        navLinks.on("click", function() {
            LoadLink($(this).attr("data") as string);
        });
        navLinks.on("mouseover", function() {
            $(this).css("cursor", "pointer");
        });

        mainButt.on("click", function() {
            LoadLink($(this).attr("data") as string);
        });
        mainButt.on("mouseover", function() {
            $(this).css("cursor", "pointer");
        });
    }

    function AddLinkEvents(link:string):void {
        let linkQuery = $(`a.link[data=${link}]`);

        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");

        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function() {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });

        linkQuery.on("mouseout", function() {
            $(this).css("font-weight", "normal");
        });
    }

    function Display404Page() :void{
        console.log("Displaying 404 Page")
    }

    /**
     * Instantiate and add contact to localStorage
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName:string, contactNumber:string, emailAddress:string) :void {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.FullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    function DisplayHomePage() :void{
        console.log("Display Home Called");

        $("#ProductsBtn").on("click",  () => {LoadLink("products")});
        $("#ServicesBtn").on("click",  () => {LoadLink("services")});
        $("#AboutUsBtn").on("click",   () => {LoadLink("about")});
        $("#ContactUsBtn").on("click", () => {LoadLink("contact")});

        $("main").append('<p id="MainParagraph" class="mt-3"> This is the Main Paragraph </p>');
        $("main").append('<article>' +
                         '<p id="ArticleParagraph" class ="mt-3">This is my article paragraph</p></article>');
    }

    function DisplayProductsPage() :void{
        console.log("Display Products Called");
    }

    function DisplayServicesPage() :void{
        console.log("Display Services Page Called");
    }

    function ContactFormValidation() :void{
        // Validate full name
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-Z][a-z]+))*$/,
            "Please enter a valid first and last name (ex. Mr. Peter Parker)");
        // Validate Phone Number
        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid phone number (ex. 555 555-5555");
        // Validate Email Address
        ValidateField("#email",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address (ex. example@email.com");
    }

    function ValidateField(input_field_id:string, regular_expression:RegExp, error_message:string) :void {
        let errorMessage = $("#errorMessage");
        errorMessage.hide();

        $(input_field_id).on("blur", function() {
            let inputFieldText = $(this).val() as string;

            if(!regular_expression.test(inputFieldText)) {
                // Failed validation
                $(this).trigger("focus").trigger("select"); /// Focus back to input field and highlight
                errorMessage.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                // Pass Validation
                errorMessage.removeAttr("class").hide();
            }
        });
    }

    function DisplayContactsPage() :void{
        console.log("Display Contacts Called");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {LoadLink("contact-list");});

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function (event)
        {
            if(subscribeCheckbox.checked){
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;

                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }

    function DisplayAboutPage() :void{
        console.log("Display About us page Called");
    }

    function DisplayContactListPage(){
        console.log("Display Contact List page Called");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList") as HTMLElement;
            let data = "";                          // add deserialized data from local storage

            let keys = Object.keys(localStorage);   // return a string array of Keys

            let index = 1;
            for(const key of keys){
                let contactData = localStorage.getItem(key) as string;
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.FullName}</td>
                        <td>${contact.ContactNumber}</td>
                        <td>${contact.EmailAddress}</td>
                        
                        <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                 <i class="fas fa-edit fa-sm"></i> Edit </button>
                        </td>
                        
                        <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm danger delete">
                                 <i class="fas fa-trash-alt fa-sm"></i> Delete </button>
                        </td>
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;

            $("#addButton").on("click", () => {
                LoadLink("edit", "add");
            });

            $("button.delete").on("click", function () {
                if (confirm("Delete Contact? Please confirm: ")) {
                    localStorage.removeItem($(this).val() as string)
                }
                LoadLink("contact-list");
            });

            $("button.edit").on("click", function() {
                LoadLink("edit", $(this).val() as string);
            });
        }
    }

    function DisplayEditPage() :void{
        console.log("Display Edit Page called");

        ContactFormValidation();

        let page = location.hash.substring(1);
        switch(page) {
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"></i> Add`);

                $("#editButton").on("click", (event) => {
                    event.preventDefault();

                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;

                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contact-list");
                });

                $("#cancelButton").on("click", () => {LoadLink("contact-list");});
                break;

            default: {
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page) as string);

                $("#fullName").val(contact.FullName);
                $("#contactNumber").val(contact.ContactNumber);
                $("#emailAddress").val(contact.EmailAddress);

                $("#editButton").on("click", (event) => {
                    event.preventDefault();

                    contact.FullName = $("#fullName").val() as string;
                    contact.ContactNumber = $("#contactNumber").val() as string;
                    contact.EmailAddress = $("#emailAddress").val() as string;

                    localStorage.setItem(page, contact.serialize() as string);

                    LoadLink("contact-list");
                });

                $("#cancelButton").on("click", () => {LoadLink("contact-list");});
            }
        }
    }

    function DisplayRegisterPage() :void {
        console.log("Display Register page Called");
        }

    function CheckLogin() :void{
        if (sessionStorage.getItem("user")) {
            $("#login").html('<a id="logout" class="nav-link" href="#"' +
                '<i class="fa-solid fa-sign-out-alt"></i> Logout</a>');
        }
        $("#logout").on("click", function() {
            sessionStorage.clear();

            $("#login").html('<li><a id="login" class="nav-link" data="login">' +
                '<i class="fa-solid fa-sign-in-alt"></i> Login</a></li>');

            AddNavigationEvents();

            LoadLink("login");
        });
    }

    function DisplayLoginPage() :void {
        console.log("Display Login page Called");

        let messageArea2 = $("#messageArea2");
        messageArea2.hide();

        AddLinkEvents("register");

        $("#loginButton").on("click", function() {
            let success = false;
            let newUser = new core.User();

            $.get("Data/user.json", function (data) {
                for (const u of data.users) {

                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;

                    if(username === u.UserName && password === u.Password) {
                        success = true;
                        newUser.fromJSON(u);
                        break;

                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize() as string);
                    messageArea2.removeAttr("class").hide();
                    LoadLink("contact-list");
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea2.addClass("alert alert-danger").text("Failed to authenticate");
                    messageArea2.show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });

    }
})();