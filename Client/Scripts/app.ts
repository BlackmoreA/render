"use strict";

//IIFE - Immediately Invoke Function Expression
//AKA - Anonymous Self - Executing Function
// AjaxRequest("GET", "../Views/Components/header.html", LoadHeader);

(function(){
    function Start()
    {
        console.log("App Started!");

        let page_id = $("body")[0].getAttribute("id");

        switch(page_id)
        {
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
                //AuthGuard();
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
                //AuthGuard();
                DisplayEditPage();
            case "edit":
                //AuthGuard();
                DisplayEditPage();
            case "404":
                Display404Page();
                break;
        }

    }
    window.addEventListener("load", Start)

    function AuthGuard():void {
        let protected_routes = ["contact-list", "edit"];

        if (protected_routes.indexOf(location.pathname) > -1) {
            if (!sessionStorage.getItem("user")) {
                location.href = "/login";
            }
        }
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

        $("#ProductsBtn").on("click",  () => {location.href = "/products"});
        $("#ServicesBtn").on("click",  () => {location.href = "/services"});
        $("#AboutUsBtn").on("click",   () => {location.href = "/about"});
        $("#ContactUsBtn").on("click", () => {location.href = "/contact"});

        // $("main").append('<p id="MainParagraph" class="mt-3"> This is the Main Paragraph </p>');
        // $("main").append('<article>' +
        //                  '<p id="ArticleParagraph" class ="mt-3">This is my article paragraph</p></article>');
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
        $("a[data='contact-list']").on("click", function () {location.href = "/contact-list";});

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

        $("a.delete").on("click", function (event) {
            if (!confirm("Delete Contact? Please confirm: ")) {
                event.preventDefault();
                location.href = "/contact-list";
            }
        });
    }

    function DisplayEditPage() :void{
        console.log("Display Edit Page called");

        ContactFormValidation();
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

            location.href = "/home";
        });
    }

    function DisplayLoginPage() :void {
        console.log("Display Login page Called");
    }
})();