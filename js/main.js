$(document).ready(function(){

    //AJAX
    function ajaxCallBack(file, callback, lsKey){
        $.ajax({
            url: "/data/" + file + ".json",
            method: "GET",
            dataType: "json",
            success: function(data){
                callback(data, lsKey);
            },
            error: function(error){
                console.log(error);
            }
        });
    }
    function saveInLocalStorage(data, lsKey){
        localStorage.setItem(lsKey, JSON.stringify(data));
    }
    function readLocalStorage(item){
        return JSON.parse(localStorage.getItem(item));
    }
    function deleteLocalStorage(item){
        localStorage.removeItem(item);
    }

    //Header animations
    let allMains = ["#authorMain", "#cartMain", "#contactMain", "#registerMain", "#shopMain"];

    function headerAnimation(leftTimeout, rightTimeout, rightDelay){
        $('#standardHeaderLeft').animate({
            opacity: 1
        }, leftTimeout);
        setTimeout(function(){
            $('#standardHeaderRight').animate({
                opacity: 1
            }, rightTimeout);
        }, rightDelay);
    }
    headerAnimation(700, 700, 200);

    function mainContentAnimation(transition, delay){
        for (let i = 0; i < allMains.length; i++){
            setTimeout(function(){
                $(allMains[i]).animate({
                    opacity: 1
                }, transition);
            }, delay);
        }
    }
    mainContentAnimation(700, 400);

    /*Regular expressions*/
    const fullnameRegex = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
    const usernameRegex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

    //Updating cart icon
    function updateCartIcon(numOfCartItems){
        let bubbleNumValue = document.getElementById("bubbleNumValue");
        let mobileCartNum = document.getElementById("mobile-cart-num");
        $(bubbleNumValue).parent().addClass('bubbleAnimation');
        setTimeout(function(){
            $(bubbleNumValue).parent().removeClass('bubbleAnimation');
        }, 300);
        bubbleNumValue.innerHTML = numOfCartItems;
        mobileCartNum.innerHTML = `<p>${numOfCartItems}</p>`;

        if (numOfCartItems == 0){
            $(bubbleNumValue).parent().hide();
            mobileCartNum.innerHTML = "<p>-</p>";
        }
        else{
            $(bubbleNumValue).parent().show();
        }
    }

    let cartList;
    if (readLocalStorage("cartList") == null){
        cartList = [];
    }
    else{
        cartList = readLocalStorage("cartList");
    }

    updateCartIcon(cartList.length);

    //Phone side menu
    let isOnPhone = false;
    if ((window.screen.width) < 426) isOnPhone = true;
    else isOnPhone = false;
    $(window).resize(function(){
        if ((window.screen.width) < 426) isOnPhone = true;
        else isOnPhone = false;
    });
    $('#hamburgerMenu').click(function(){
        $('#phoneSideMenu').show();
        $('#phoneSideMenu').animate({
            right: '0'
        });
        $('main').addClass('focusFilter');
    });
    $('#closeSlideMenu').click(function(){
        if (isOnPhone){
            $('#phoneSideMenu').animate({
                right: '-80%'
            });
        }
        else{
            $('#phoneSideMenu').animate({
                right: '-50%'
            });
        }
        $('#phoneSideMenu').hide(200);
        $('main').removeClass('focusFilter');
    });

    //Login changes
    let loginObj = readLocalStorage("loginStatus");
    if(loginObj){
        $('#account-empty').addClass("hiddenItem");
        $('#account-user').removeClass("hiddenItem");
        $('#account-username').text(loginObj.username);
        $('#account-email').text(loginObj.email);
        $('#accountOption').html(`<i class="las la-times-circle"></i>`);
        if (document.location.pathname == "/registration.html"){
            deleteLocalStorage("loginStatus");
            window.location.href = "/index.html";
        }
    }
    else{
        $('#account-empty').removeClass("hiddenItem");
        $('#account-user').addClass("hiddenItem");
        $('#accountOption').html(`<i class="las la-user-circle"></i>`);
        $('#account-username').text("");
        $('#account-email').text("");
    }

    //Phone account buttons
    let accBtnPress = false;
    $('#mobile-empty-button').click(function(){
        if(accBtnPress){
            accBtnPress = false;
            $('#mobile-empty-dropIcon').animate({
                rotate: "0deg"
            });
            $('#mobile-empty-body').slideUp(300);
        }
        else{
            accBtnPress = true;
            $('#mobile-empty-dropIcon').animate({
                rotate: "180deg"
            });
            $('#mobile-empty-body').slideDown(300);
        }
    });
    $('#mobile-account-button').click(function(){
        if(accBtnPress){
            accBtnPress = false;
            $('#mobile-account-dropIcon').animate({
                rotate: "0deg"
            });
            $('#mobile-account-body').slideUp(300);
        }
        else{
            accBtnPress = true;
            $('#mobile-account-dropIcon').animate({
                rotate: "180deg"
            });
            $('#mobile-account-body').slideDown(300);
        }
    });

    //Phone search
    let searchQuery = document.getElementById("mobile-inputSearch");
    $('#mobileSearch i').click(function(){
        window.location.href = `/shop.html?search=${searchQuery.value}`;
    });

    //INDEX.HTML
    if (document.location.pathname == "/index.html"){
        console.log("Im on page", document.location.pathname);
        $('.pictureCarousel').slick({
            fade: true,
            infinite: true,
            dots: true,
            speed: 1500,
            autoplay: true,
            prevArrow: false,
            nextArrow: false
        });
        $('#bannerUI').fadeIn(2000);
        $('#specialOffers div:even').css('background-color', '#baff67');
        $('.offerObject').children().hover(function(){
            $(this).css('transform', 'scale(1.08)');
            $(this).parent().css('filter', 'brightness(1.2)');
        }, function(){
            $(this).css('transform', 'initial');
            $(this).parent().css('filter', 'brightness(1)');
        });
    }
    
    //SHOP.HTML
    if (document.location.pathname == "/shop.html"){

        let allProducts = [];
        let allBrands = [];
        let allCategories = [];

        let shopProductsHolder = document.getElementById("shopProductsHolder");

        ajaxCallBack("products", saveInLocalStorage, "productsList");
        allProducts = readLocalStorage("productsList");
        ajaxCallBack("brands", saveInLocalStorage, "brandsList");
        allBrands = readLocalStorage("brandsList");
        ajaxCallBack("categories", saveInLocalStorage, "categoriesList");
        allCategories = readLocalStorage("categoriesList");

        let sortOptionList = ["Highest Rated", "Lowest Rated", "Name A-Z", "Name Z-A", "Price Highest", "Price Lowest", "Date Newest", "Date Oldest"];

        function updateShop(data){
            let htmlCode = "";
            shopProductsHolder.innerHTML = "";

            //Filters
            data = filterSearch(data);
            data = filterCategory(data);
            data = filterBrand(data);
            data = filterPrice(data);
            data = filterSale(data);

            //Sorting
            data = sortFunction(data);

            //Generating script
            if (data.length > 0){
                data.forEach(item => {
                    htmlCode +=
                    `
                        <div class="shopProduct" data-id="${item.id}">
                            <div class="productHead">
                                <img src="images/productImages/${item.mainImage.src}" alt="${item.mainImage.alt}" class="productImage" />
                                <div class="productHeadDiscounts">
                                    <div class="discountName">
                                        <p>${findDiscount(item.discounts, "name")}</p>
                                    </div>
                                    <div class="discountDesc">
                                        <p>${findDiscount(item.discounts, "desc")}</p>
                                    </div>
                                </div>
                                <div class="productHeadControls">
                                    <div class="addToCartHover">
                                        <i class="las la-cart-arrow-down"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="productBody">
                                <p class="productName">${item.name}</p>
                                <p class="productBrand">${findBrand(item.brandId)}</p>
                                <div class="productPrices">
                                    <p class="currentPrice">$${findNewPrice(item.prices, item.discounts)}</p>
                                    <p class="oldPrice">${findOldPrice(item.prices, item.discounts)}</p>
                                </div>
                                <p class="productRating">
                                    ${findRating(item.rating)}
                                </p>
                            </div>
                        </div>
                    `;
                });
    
                //Display
                shopProductsHolder.innerHTML = htmlCode;

                //Add hover controls
                $('.productHead').hover(function(){
                    $(this).find('.productHeadControls').css('display', 'flex');
                }, function(){
                    $(this).find('.productHeadControls').css('display', 'none');
                });
                //Adding to cart on click
                $('.productHead').find('.addToCartHover').click(function(){
                    addToCart($(this).parent().parent().parent().data("id"));
                });
    
                //Price Filters Update
                findHighestPrice(data);
            }
            else{
                console.log("NIŠTA");
                findHighestPrice(data);
            }
        }

        //Dynamic Filters
        function listFilter(blockId, data, inputType, optionIdTeml){
            let filterBlock = document.getElementById(blockId);
            let htmlCode = "";

            //Generating code
            if (inputType == "checkbox"){
                data.forEach(element => {
                    htmlCode +=
                    `
                        <div class="filterCheckDevices">
                            <input type="checkbox" id="${optionIdTeml + "-" + element.id}" name="deviceTypes" /><label for="${optionIdTeml + "-" + element.id}">${element.name} (${countCat(element.id)})</label>
                        </div>
                    `;
                });
            }
            else{
                data.forEach(element => {
                    htmlCode +=
                    `
                        <li class="brandItem" data-id="${element.id}">${element.name} (${countBrands(element.id)})</li>
                    `;
                });
            }

            //Count functions
            function countCat(catId){
                let number = 0;
                let catList = allProducts.filter(x => (x.categoryId).includes(catId));
                number = catList.length;
                return number;
            }
            function countBrands(brandId){
                let number = 0;
                let brandList = allProducts.filter(x => x.brandId == brandId);
                number = brandList.length;
                return number;
            }

            //Drawing filter
            filterBlock.innerHTML = htmlCode;
        }

        //Dynamic sort
        function listSort(optionsList){
            let sortList = document.getElementById("sortList");
            sortList.innerHTML = "";
            for (let i = 0; i < optionsList.length; i++){
                sortList.innerHTML += 
                `
                    <option value=${i}>${optionsList[i]}</option>
                `;
            }
        }

        listSort(sortOptionList);

        //Filters
        function filterSearch(data){
            let newData = [];
            if (inputSearchValue == ""){
                return data;
            }
            newData = data.filter(x => (x.name).toLowerCase().includes(inputSearchValue.toLowerCase()));
            return newData;
        }
        function filterCategory(data){
            let newData = [];
            if (selectedCategoryList.length == 0){
                return data;
            }
            for (let i = 0; i < data.length; i++){
                for (let j = 0; j < selectedCategoryList.length; j++){
                    if (data[i].categoryId.includes(selectedCategoryList[j])){
                        newData.push(data[i]);
                    }
                }
            }
            return newData;
        }
        function filterBrand(data){
            let newData = [];
            if (selectedBrand.length == 0){
                return data;
            }
            newData = data.filter(x => x.brandId == selectedBrand);
            return newData;
        }
        function filterPrice(data){
            let newData = [];
            data.forEach(item => {
                if ((parseInt((findNewPrice(item.prices, item.discounts, "number"))) > minValue) && (parseInt((findNewPrice(item.prices, item.discounts, "number"))) < maxValue)){
                    newData.push(item);
                }
            });
            if (maxValue <= 0 || minValue <= 0){
                return data;
            }
            return newData;
        }
        function filterSale(data){
            let newData = [];
            if (selectedSaleOpt != null){
                if (selectedSaleOpt == 0){
                    for (let i = 0; i < data.length; i++){
                        let list = (data[i].discounts).filter(x => x.discountActive == "1");
                        if (list.length == 0){
                            newData.push(data[i]);
                        }
                    }
                }
                if (selectedSaleOpt == 1){
                    for (let i = 0; i < data.length; i++){
                        let list = (data[i].discounts).filter(x => x.discountActive == "1");
                        if (list.length != 0){
                            newData.push(data[i]);
                        }
                    }
                }
            }
            if (selectedSaleOpt == null){
                return data;
            }
            
            return newData;
        }

        //Sorting
        function sortFunction(data){
            let sortedData = [];
            switch(sortListValue){
                //Highest rated
                case "0": {
                    sortedData = data.sort(function(a, b){
                                      let ratingA = a.rating;
                                      let ratingB = b.rating;
                                      return ratingB - ratingA;
                                 });
                    break;
                }
                //Lowest rated
                case "1": {
                    sortedData = data.sort(function(a, b){
                                      let ratingA = a.rating;
                                      let ratingB = b.rating;
                                      return ratingA - ratingB;
                                 });
                    break;
                }
                //Name A-Z
                case "2": {
                    sortedData = data.sort(function(a, b){
                                      if (a.name < b.name){
                                        return -1;
                                      }
                                      if (a.name > b.name){
                                        return 1;
                                      }
                                 });
                    break;
                }
                //Name Z-A
                case "3": {
                    sortedData = data.sort(function(a, b){
                                      if (a.name < b.name){
                                        return 1;
                                      }
                                      if (a.name > b.name){
                                        return -1;
                                      }
                                 });
                    break;
                }
                //Price Highest
                case "4": {
                    sortedData = data.sort(function(a, b){
                                      let priceA = findNewPrice(a.prices, a.discounts, "number");
                                      console.log(priceA);
                                      let priceB = findNewPrice(b.prices, b.discounts, "number");
                                      console.log(priceB);
                                      return priceB - priceA;
                                 });
                    break;
                }
                //Price Lowest
                case "5": {
                    sortedData = data.sort(function(a, b){
                                      let priceA = findNewPrice(a.prices, a.discounts, "number");
                                      console.log(priceA);
                                      let priceB = findNewPrice(b.prices, b.discounts, "number");
                                      console.log(priceB);
                                      return priceA - priceB;
                                 });
                    break;
                }
                //Date Newest
                case "6": {
                    sortedData = data.sort(function(a, b){
                                      let dateA = new Date(a.dateAdded);
                                      let dateB = new Date(b.dateAdded);
                                      return new Date(dateB - dateA);
                                 });
                    break;
                }
                //Date Oldest
                case "7": {
                    sortedData = data.sort(function(a, b){
                                      let dateA = new Date(a.dateAdded);
                                      let dateB = new Date(b.dateAdded);
                                      return new Date(dateA - dateB);
                                 });
                    break;
                }
            }
            return sortedData;
        }

        function findBrand(id){
            let brand = allBrands.filter(x => x.id == id);
            return brand[0].name;
        }
        function findNewPrice(pricesObj, discountObj, returnType = "string"){
            let price = "";
            //Finding newest price
            let newestPriceObj = pricesObj.sort(function(a, b){
                                     let dateA = new Date(a.priceDate);
                                     let dateB = new Date(b.priceDate);
                                     return new Date(dateB - dateA);
                                 });
            //Finding discount if present
            let activeDiscount = discountObj.filter(x => x.discountActive == "1");

            if (activeDiscount.length != 0){
                //Calculating price
                price = (newestPriceObj[0].priceValue * ((100 - activeDiscount[0].discountAmmount) * 0.01));
                price = price.toString();
            }
            else{
                //Returning normal price
                price = (newestPriceObj[0].priceValue).toString();
            }

            if (returnType == "number") return (price.substring(0, price.length - 2));

            //Formating price
            let numerator = 0;
            for (let i = price.length; i > 0; i--){
                if (i == (price.length - 2)){
                    price = price.substring(0, i) + "." + price.substring(i, price.length);
                }
                if (i < (price.length - 2)){
                    numerator++;
                    if((numerator % 4) == 0){
                        price = price.substring(0, i) + "," + price.substring(i, price.length);
                        numerator++;
                    }
                }
            }

            //Returning price
            return price;
        }
        function findOldPrice(pricesObj, discountObj){
            let price = "";

            //Checking for active discounts
            let activeDiscount = discountObj.filter(x => x.discountActive == "1");
            if (activeDiscount.length == 0){
                return "";
            }
            else{
                //Finding newest price
                let newestPriceObj = pricesObj.sort(function(a, b){
                                         let dateA = new Date(a.priceDate);
                                         let dateB = new Date(b.priceDate);
                                         return new Date(dateB - dateA);
                                     });
                price = newestPriceObj[0].priceValue;
            }

            price = price.toString();

            //Formating price
            let numerator = 0;
            for (let i = price.length; i > 0; i--){
                if (i == (price.length - 2)){
                    price = price.substring(0, i) + "." + price.substring(i, price.length);
                }
                if (i < (price.length - 2)){
                    numerator++;
                    if((numerator % 4) == 0){
                        price = price.substring(0, i) + "," + price.substring(i, price.length);
                    }
                }
            }

            //Returning price
            return "$" + price;
        }
        function findRating(ratingNum){
            let ratingString = "";
            for (let i = 0; i < ratingNum; i++){
                ratingString += `<i class="las la-star ratingColorBlack"></i>`;
            }
            for (let i = ratingNum; i < 5; i++){
                ratingString += `<i class="las la-star ratingColorGray"></i>`;
            }
            return ratingString;
        }
        function findDiscount(discountsObj, type){
            let discountText = "";
            let activeDiscount = [];
            switch(type){
                case "name": {
                    activeDiscount = discountsObj.filter(x => x.discountActive == "1");
                    if (activeDiscount.length == 0){
                        discountText = "";
                    }
                    else{
                        discountText = activeDiscount[0].discountName;
                    }
                    break;
                };
                case "desc":{
                    activeDiscount = discountsObj.filter(x => x.discountActive == "1");
                    if (activeDiscount.length == 0){
                        discountText = "";
                    }
                    else{
                        discountText = activeDiscount[0].discountDesc;
                    }
                    break;
                };
            }
            return discountText;
        }
        function findHighestPrice(data){
            let highestPrice = 0;
            if (data.length != 0){
                let priceObj = data.sort(function(a, b){
                                    let discountA = (a.discounts).filter(x => x.discountActive == "1");
                                    let priceA = a.prices[0].priceValue;
                                    if (discountA.length != 0){
                                        priceA = a.prices[0].priceValue * ((100 - discountA[0].discountAmmount) * 0.01);
                                    }
                                    let discountB = (b.discounts).filter(x => x.discountActive == "1");
                                    let priceB = b.prices[0].priceValue;
                                    if (discountB.length != 0){
                                        priceB = b.prices[0].priceValue * ((100 - discountB[0].discountAmmount) * 0.01);
                                    }
                                    return priceB - priceA;
                                });
                let activeDiscount = (priceObj[0].discounts).filter(x => x.discountActive == "1");
                highestPrice = priceObj[0].prices[0].priceValue;
                if (activeDiscount.length != 0){
                    highestPrice = priceObj[0].prices[0].priceValue * ((100 - activeDiscount[0].discountAmmount) * 0.01);
                }
                highestPrice = highestPrice.toString();
                highestPrice = highestPrice.substring(0, highestPrice.length - 2);
                highestPrice = parseInt(highestPrice) + 1;
            }
            let inputPriceRange = document.getElementById("inputPriceRange");
            let maxPriceInput = document.getElementById("maxPriceInput");
            inputPriceRange.setAttribute("max", highestPrice);
            maxPriceInput.setAttribute("value", highestPrice);
            //If called as a setter
            return highestPrice;
        }

        //Adding to cart
        function addToCart(itemId){
            let itemObj = allProducts.filter(x => x.id == itemId);
            cartList.push(itemObj[0]);
            saveInLocalStorage(cartList, "cartList");
            updateCartIcon(cartList.length);
        }

        listFilter("types", allCategories, "checkbox", "dt");
        listFilter("filterChooseBrand", allBrands, "options", "");

        //Filter and sort triggers
        //SEARCH TEXTS
        let inputSearch = document.getElementById("inputSearch");
        let inputSearchValue = inputSearch.value;
        let startSearchBtn = document.getElementById("startSearchBtn");
        startSearchBtn.addEventListener("click", function(){
            inputSearchValue = inputSearch.value;
            updateShop(allProducts);
        });
        //CATEGORY CHECKBOXES
        let deviceTypes = document.getElementsByName("deviceTypes");
        let selectedCategoryList = [];
        deviceTypes = Array.from(deviceTypes);
        deviceTypes.forEach(type => {
            type.addEventListener("change", function(){
                if (this.checked){
                    selectedCategoryList.push(type.id.substring(3, (type.id).length));
                    updateShop(allProducts);
                }
                else{
                    selectedCategoryList.splice(selectedCategoryList.indexOf(type.id), 1);
                    updateShop(allProducts);
                }
            });
        })
        //BRANDS OPTIONS
        let deviceBrands = document.getElementsByClassName("brandItem");
        let selectedBrand = "";
        deviceBrands = Array.from(deviceBrands);
        deviceBrands.forEach(brand => {
            brand.addEventListener("click", function(){
                selectedBrand = $(this).data("id");
                updateShop(allProducts);
            });
        });
        //PRICE RANGE
        let inputPriceRange = document.getElementById("inputPriceRange");
        let minPriceInput = document.getElementById("minPriceInput");
        let maxPriceInput = document.getElementById("maxPriceInput");
        let maxValue = 0;
        let minValue = 0;
        minPriceInput.addEventListener("input", function(){
            inputPriceRange.value = minPriceInput.value;
            minValue = minPriceInput.value;
            maxValue = findHighestPrice(allProducts);
            maxPriceInput.value = maxValue;
            updateShop(allProducts);
        });
        inputPriceRange.addEventListener("input", function(){
            minPriceInput.value = inputPriceRange.value;
            minValue = inputPriceRange.value;
            maxValue = findHighestPrice(allProducts);
            maxPriceInput.value = maxValue;
            updateShop(allProducts);
        });
        //SALE OPTION
        let saleItems = document.getElementsByClassName("saleItem");
        let selectedSaleOpt = null;
        saleItems = Array.from(saleItems);
        saleItems.forEach(opt => {
            opt.addEventListener("click", function(){
                selectedSaleOpt = $(this).data("id");
                updateShop(allProducts);
            });
        });
        //SORTING OPTION
        let sortList = document.getElementById("sortList");
        let sortListValue = sortList.value;
        sortList.addEventListener("change", function(){
            sortListValue = sortList.value;
            updateShop(allProducts);
        });

        //SEARCH FROM OTHER PAGE
        if ((window.location.href).includes("=")){
            let searchText = (window.location.href).substring((window.location.href).indexOf("=") + 1, (window.location.href).length);
            inputSearch.value = searchText;
            inputSearchValue = inputSearch.value;
            updateShop(allProducts);
        }

        //Filters dropdown
        $('.filterTitle').click(function(){
            $(this).parent().next().toggle(300);
            $(this).find('i').toggleClass("rotate");
        });
        

        updateShop(allProducts);
        
    }

    //CONTACT.HTML
    if (document.location.pathname == "/contact.html"){
        //All important inputs as a list
        let importantInputs = document.getElementsByClassName("contactFormInputField");
        //All inputs as independent objects
        let nameInput = document.getElementById("nameInput");
        let lastnameInput = document.getElementById("lastnameInput");
        let emailInput = document.getElementById("emailInput");
        let mobileInput = document.getElementById("mobileInput");
        let mobileInput2 = document.getElementById("mobileInput2");
        let subjectInput = document.getElementById("subjectInput");
        let messageInput = document.getElementById("messageInput");
        //Error list

        //Buttons
        let submitButton = document.getElementById("submitButton");
        let resetButton = document.getElementById("resetButton");

        importantInputs = Array.from(importantInputs);
        submitButton.addEventListener("click", function(){
            //Error Functions
            function showInputError(inputObj, errorMessage){
                $(inputObj).addClass('inputError');
                let currentValue = $(inputObj).val();
                let placeholder = $(inputObj).attr('placeholder');
                $(inputObj).attr('placeholder', errorMessage);
                $(inputObj).val('');
                $(inputObj).next().removeClass('inputHelp');
                $(inputObj).next().addClass('inputDisclaimer');
                $(inputObj).next().addClass('inputAlertAnim');
                setTimeout(function(){
                    $(inputObj).next().removeClass('inputAlertAnim');
                }, 200);
                setTimeout(function(){
                    $(inputObj).removeClass('inputError');
                    $(inputObj).attr('placeholder', placeholder);
                    $(inputObj).val(currentValue);
                }, 1000);
            }
            function dropInputError(inputObj){
                $(inputObj).next().removeClass('inputDisclaimer');
                $(inputObj).next().addClass('inputHelp');
            }

            //Acquiring values
            let nameValue = nameInput.value;
            let lastnameValue = lastnameInput.value;
            let emailValue = emailInput.value;
            let mobileValue = mobileInput.value;
            let mobileValue2 = mobileInput2.value;
            let subjectValue = subjectInput.value;
            let messageValue = messageInput.value;

            //Validating form
            /*Validation system*/

            function checkAll(){
                if (firstNameCheck() && lastNameCheck() && emailCheck() && mobileCheck() && subjectCheck() && messageCheck()){
                    dropInputError(nameInput);
                    dropInputError(lastnameInput);
                    dropInputError(emailInput);
                    dropInputError(mobileInput);
                    dropInputError(mobileInput2);
                    dropInputError(subjectInput);
                    dropInputError(messageInput);
                    //Message sent
                    $(submitButton).removeClass('contactFormButtons');
                    $(submitButton).addClass('formButtonSuccess');
                    $(submitButton).val('MESSAGE SUCCESSFULY SENT');
                    $(submitButton).attr('disabled', 'disabled');
                }
                else{
                    //Showing or hiding error messages
                    if (firstNameCheck() == null) showInputError(nameInput, "Name in wrong format");
                    else dropInputError(nameInput);
                    if (lastNameCheck() == null) showInputError(lastnameInput, "Last name in wrong format");
                    else dropInputError(lastnameInput);
                    if (emailCheck() == null) showInputError(emailInput, "E-Mail in wrong format");
                    else dropInputError(emailInput);
                    if (mobileCheck() == null) showInputError(mobileInput, "Number in wrong format");
                    else dropInputError(mobileInput);
                    if (mobile2Check() == null) showInputError(mobileInput2, "Number in wrong format");
                    else dropInputError(mobileInput2);
                    if (subjectCheck() == null) showInputError(subjectInput, "Subject field empty");
                    else dropInputError(subjectInput);
                    if (messageCheck() == null) showInputError(messageInput, "Message field empty");
                    else dropInputError(messageInput);
                    return;
                }
            }

            function firstNameCheck(){
                return (nameValue.match(fullnameRegex));
            }
            function lastNameCheck(){
                return (lastnameValue.match(fullnameRegex));
            }
            function emailCheck(){
                return (emailValue.match(emailRegex));
            }
            function mobileCheck(){
                return (mobileValue.match(phoneRegex));
            }
            function mobile2Check(){
                if (mobileValue2 != ""){
                    return (mobileValue2.match(phoneRegex));
                }
                else return 1;
            }
            function subjectCheck(){
                if (subjectValue != ""){
                    return 1;
                }
                else{
                    return null;
                }
            }
            function messageCheck(){
                if (messageValue != ""){
                    return 1;
                }
                else{
                    return null;
                }
            }

            checkAll();
        });
        resetButton.addEventListener("click", function(){
            $('#submitButton').removeAttr('disabled');
            $('#submitButton').removeClass('formButtonSuccess');
            $('#submitButton').addClass('contactFormButtons');
            $('#submitButton').val('SUBMIT FORM');
        });
    }

    //CART.HTML
    if (document.location.pathname == "/cart.html"){
        //Coupon code
        let couponCode = {
            "codeString": "web2",
            "codeValue": "20"
        };
        let activateCoupon = false;
        //Blocks
        let cartBody = document.getElementById("cartBody");
        let cartContainer = document.getElementById("cartTableHolder");
        let totalSection = document.getElementById("totalSection");
        let discountInput = document.getElementById("discountInput");
        let applyDiscountButton = document.getElementById("applyDiscountButton");
        let htmlCode = "";
        //Checkout button
        let checkoutFormButton = document.getElementById("checkoutButton");

        //Dynamic cart filling
        function updateCart(){
            //Updating list from local storage
            cartList = readLocalStorage("cartList");
            htmlCode = "";
            //Cart wont show duplicated, but will count them
            let uniqueIds = [];
            let numerator = 1;
            let totalPrice = 0;
            if (cartList != null){
                cartList.forEach(cartItem => {
                    if (!uniqueIds.includes(cartItem.id)){
                        htmlCode +=
                        `
                            <tr data-itemid="${cartItem.id}">
                                <td>${numerator++}</td>
                                <td><img src="images/productImages/${cartItem.mainImage.src}" alt="${cartItem.mainImage.alt}" /></td>
                                <td><p>${cartItem.name}</p></td>
                                <td>
                                    <div class="quantityControl" data-function="increase">
                                        <i class="las la-angle-up"></i>
                                    </div>
                                    <p class="quantityNumber">${countInCart(cartItem.id)}</p>
                                    <div class="quantityControl" data-function="decrease">
                                        <i class="las la-angle-down"></i>
                                    </div>
                                </td>
                                <td>$${rowPrice(cartItem, countInCart(cartItem.id))}</td>
                                <td class="deleteCartItem"><i class="las la-trash"></i></td>
                            </tr>
                        `;
                        totalPrice += rowPrice(cartItem, countInCart(cartItem.id), true);
                    }
                    uniqueIds.push(cartItem.id);
                });
            }

            if(activateCoupon){
                totalPrice = totalPrice * ((100 - couponCode.codeValue) * 0.01);
            }
            totalPrice = fancyPrice(totalPrice.toString());
            cartBody.innerHTML = htmlCode;

            //Hide pictures on phone
            if (isOnPhone){
                $('table img').addClass("hiddenItem");
            }
            else{
                $('table img').removeClass("hiddenItem");
            }

            $('.quantityControl').click(function(){
                if ($(this).data("function") == "increase"){
                    let itemId = $(this).parent().parent().data("itemid");
                    let item = cartList.filter(x => x.id == itemId);
                    cartList.push(item[0]);
                    saveInLocalStorage(cartList, "cartList");
                    updateCart();
                    updateCartIcon(cartList.length);
                }
                if ($(this).data("function") == "decrease"){
                    let itemId = $(this).parent().parent().data("itemid");
                    let item = cartList.filter(x => x.id == itemId);
                    cartList.splice(cartList.indexOf(item[0]), 1);
                    saveInLocalStorage(cartList, "cartList");
                    updateCart();
                    updateCartIcon(cartList.length);
                }
            });

            $('.deleteCartItem').click(function(){
                let itemId = $(this).parent().data("itemid");
                let newCartList = cartList.filter(x => x.id != itemId);
                cartList = newCartList;
                saveInLocalStorage(cartList, "cartList");
                updateCart();
                updateCartIcon(cartList.length);
            });

            if (cartList != null){
                totalSection.innerHTML = "<h4>SUBTOTAL: </h4>";
                uniqueIds = [];
                cartList.forEach(listItem => {
                    if (!uniqueIds.includes(listItem.id)){
                        totalSection.innerHTML +=
                        `
                            <p>${rowPrice(listItem, countInCart(listItem.id))} +</p>
                        `;
                        uniqueIds.push(listItem.id);
                    }
                });
                if (activateCoupon){
                    totalSection.innerHTML += `<h5>Coupon ${couponCode.codeValue}% OFF activated!</h5>`;
                }
                totalSection.innerHTML += `<br/><h4>TOTAL: $${totalPrice}</h4>`;
            }

            if (cartList == null || cartList.length == 0){
                cartContainer.innerHTML = "<div id='emptyCartMessage'><span>Your cart is empty</span></div>";
                totalSection.innerHTML = "<h3>EMPTY CART</h3>"
            }
        }

        updateCart();

        //Functions
        function countInCart(itemId){
            let numberOfItems = (cartList.filter(x => x.id == itemId)).length;
            return numberOfItems;
        }
        function rowPrice(cartItem, numberOfItems, totalPrice = false){
            let price = (findNewPrice(cartItem.prices, cartItem.discounts, "number") * numberOfItems).toFixed(2);
            price = price.substring(0, price.indexOf(".")) + price.substring(price.indexOf(".") + 1,  price.length);
            if (totalPrice) return parseFloat(price);
            return fancyPrice(price);
        }
        function findNewPrice(pricesObj, discountObj, returnType = "string"){
            let price = "";
            //Finding newest price
            let newestPriceObj = pricesObj.sort(function(a, b){
                                     let dateA = new Date(a.priceDate);
                                     let dateB = new Date(b.priceDate);
                                     return new Date(dateB - dateA);
                                 });
            //Finding discount if present
            let activeDiscount = discountObj.filter(x => x.discountActive == "1");

            if (activeDiscount.length != 0){
                //Calculating price
                price = (newestPriceObj[0].priceValue * ((100 - activeDiscount[0].discountAmmount) * 0.01));
                price = price.toString();
            }
            else{
                //Returning normal price
                price = (newestPriceObj[0].priceValue).toString();
            }

            if (returnType == "number") return (price.substring(0, price.length - 2) + "." + price.substring(price.length - 2, price.length));
        }
        function fancyPrice(price){
            //Formating price
            let numerator = 0;
            for (let i = price.length; i > 0; i--){
                if (i == (price.length - 2)){
                    price = price.substring(0, i) + "." + price.substring(i, price.length);
                }
                if (i < (price.length - 2)){
                    numerator++;
                    if((numerator % 4) == 0){
                        price = price.substring(0, i) + "," + price.substring(i, price.length);
                        numerator++;
                    }
                }
            }

            //Returning price
            return price;
        }

        //Check for coupon codes
        applyDiscountButton.addEventListener("click", function(){
            if (couponCode.codeString == discountInput.value){
                activateCoupon = true;
                updateCart();
            }
        });

        //Unlocking checkout
        if(loginObj){
            checkoutFormButton.removeAttribute("disabled");
            checkoutFormButton.classList.remove("checkoutDisabledButton");
            checkoutFormButton.classList.add("activateCheckout");
        }
        else{
            checkoutFormButton.setAttribute("disabled", "disabled");
            checkoutFormButton.classList.add("checkoutDisabledButton");
            checkoutFormButton.classList.remove("activateCheckout");
        }

        //Finishing order
        $('.activateCheckout').click(function(){
            cartList = readLocalStorage("cartList");
            if (cartList.length == 0){
                $(this).text("CART IS EMPTY");
                $(this).addClass('checkoutEmptyError');
                setTimeout(function(){
                    $('.activateCheckout').text("PROCEED TO CHECKOUT");
                    $('.activateCheckout').removeClass('checkoutEmptyError');
                }, 1500);
            }
            else{
                $(this).text("ORDER SUCCESSFUL");
                checkoutFormButton.setAttribute("disabled", "disabled");
                $(this).addClass('checkoutFinished');
                deleteLocalStorage("cartList");
                updateCart();
            }
        });

    }

    //REGISTRATION.HTML
    if (document.location.pathname == "/registration.html"){
        //Drop down menu items and blocks
        let regBirthInputDay = document.getElementById("regBirthInput-Day");
        let regBirthInputMonth = document.getElementById("regBirthInput-Month");
        let regBirthInputYear = document.getElementById("regBirthInput-Year");

        regBirthInputDay.innerHTML = "<option value='0'>DAY</option>";
        for (let i = 0; i < 31; i++){
            regBirthInputDay.innerHTML +=
            `
                <option value="${i + 1}">${i + 1}.</option>
            `;
        }
        regBirthInputMonth.innerHTML = "<option value='0'>MONTH</option>";
        for (let i = 0; i < 12; i++){
            regBirthInputMonth.innerHTML +=
            `
                <option value="${i + 1}">${i + 1}.</option>
            `;
        }
        regBirthInputYear.innerHTML = "<option value='0'>YEAR</option>";
        let currentYear = new Date().getFullYear();
        for (let i = 1930; i < currentYear; i++){
            regBirthInputYear.innerHTML +=
            `
                <option value="${i}">${i}.</option>
            `;
        }

        //Account check and registration
        let accounts = readLocalStorage("accounts");
        if (accounts == null){
            accounts = [];
        }
        //Registration inputs
        let usernameRegInput = document.getElementById("usernameRegInput");
        let emailRegInput = document.getElementById("emailRegInput");
        let passRegInput = document.getElementById("passRegInput");
        let passRegRepeatInput = document.getElementById("passRegRepeatInput");
        let radioGender = document.getElementsByName("radioGender");
        radioGender = Array.from(radioGender);
        //Reg button
        let regSubmit = document.getElementById("regSubmit");

        regSubmit.addEventListener("click", function(){
            //Acquire inputs
            let usernameRegValue = usernameRegInput.value;
            let emailRegValue = emailRegInput.value;
            let passRegValue = passRegInput.value;
            let passRegRepeatValue = passRegRepeatInput.value;
            let radioGenderValue = "";
            for (let i = 0; i < radioGender.length; i++){
                if (radioGender[i].checked){
                    radioGenderValue = radioGender[i].value;
                    break;
                }
            }
            let regBirthDayValue = regBirthInputDay.value;
            let regBirthMonthValue = regBirthInputMonth.value;
            let regBirthYearValue = regBirthInputYear.value;
            let regBirthFullDate = `${regBirthYearValue}-${("0" + regBirthMonthValue).slice(-2)}-${("0" + regBirthDayValue).slice(-2)}`;
            let checkTermsValue = document.getElementById("checkTermsRegInput").checked;
            //Validating inputs
            function checkRegInputs(){
                if(((usernameRegValue.match(usernameRegex)) != null) && ((emailRegValue.match(emailRegex)) != null) && ((passRegValue.match(passwordRegex)) != null) && (passRegValue == passRegRepeatValue) && (radioGenderValue != null) && (radioGenderValue != "") && ((regBirthFullDate.match(dateRegex)) != null) && (checkTermsValue)){
                    //Check for account
                    if (accounts.length > 0){
                        let sameAcc = accounts.filter(x => x.email == emailRegValue);
                        if (sameAcc.length > 0){
                            regSubmit.classList.add("formButtonFailure");
                            regSubmit.setAttribute("value", "EMAIL ALREADY IN USE");
                            setTimeout(function(){
                                regSubmit.setAttribute("value", "REGISTER");
                                regSubmit.classList.remove("formButtonFailure");
                            }, 2000);
                        }
                        else{
                            let accountObject = {
                                "email": `${emailRegValue}`,
                                "username": `${usernameRegValue}`,
                                "password": `${passRegValue}`,
                                "gender": `${radioGenderValue}`,
                                "birthDate": `${regBirthFullDate}`
                            }
                            accounts.push(accountObject);
                            saveInLocalStorage(accounts, "accounts");
                            //Deactivate button and tell user its successful
                            regSubmit.setAttribute("disabled", "disabled");
                            regSubmit.setAttribute("value", "ACCOUNT SUCCESSFULY CREATED");
                            regSubmit.classList.add("formButtonSuccess");
                        }
                    }
                    else{
                        let accountObject = {
                            "email": `${emailRegValue}`,
                            "username": `${usernameRegValue}`,
                            "password": `${passRegValue}`,
                            "gender": `${radioGenderValue}`,
                            "birthDate": `${regBirthFullDate}`
                        }
                        accounts.push(accountObject);
                        saveInLocalStorage(accounts, "accounts");
                        //Deactivate button and tell user its successful
                        regSubmit.setAttribute("disabled", "disabled");
                        regSubmit.setAttribute("value", "ACCOUNT SUCCESSFULY CREATED");
                        regSubmit.classList.add("formButtonSuccess");
                    }
                }
                else{
                    if ((usernameRegValue.match(usernameRegex)) == null){
                        let regUsername = document.getElementById("regUsername");
                        showInputError(regUsername, "textInput", "Wrong username format");
                    }
                    if ((emailRegValue.match(emailRegex)) == null){
                        let regEmail = document.getElementById("regEmail");
                        showInputError(regEmail, "textInput", "Wrong email format");
                    }
                    if ((passRegValue.match(passwordRegex)) == null){
                        let regPassword = document.getElementById("regPassword");
                        showInputError(regPassword, "textInput", "Wrong password format");
                    }
                    if (passRegValue != passRegRepeatValue){
                        let regRepeatPassword = document.getElementById("regRepeatPassword");
                        showInputError(regRepeatPassword, "textInput", "Passwords don't match");
                    }
                    if ((radioGenderValue == null) || (radioGenderValue == "")){
                        let regGender = document.getElementById("regGender");
                        showInputError(regGender, "radioInput");
                    }
                    if ((regBirthFullDate.match(dateRegex)) == null){
                        let regDateOfBirth = document.getElementById("regDateOfBirth");
                        showInputError(regDateOfBirth, "selectInput");
                    }
                    if (!checkTermsValue){
                        let regTerms = document.getElementById("regTerms");
                        showInputError(regTerms, "radioInput");
                    }
                }

                function showInputError(holdingBlock, errorStyle, errorMessage){
                    if (errorStyle == "textInput"){
                        $(holdingBlock).addClass('registerError');
                        let placeholderText = $(holdingBlock).find('input').attr('placeholder');
                        let userInput = $(holdingBlock).find('input').val();
                        $(holdingBlock).find('input').val("");
                        $(holdingBlock).find('input').attr('placeholder', errorMessage);
                        setTimeout(function(){
                            $(holdingBlock).removeClass('registerError');
                            $(holdingBlock).find('input').attr('placeholder', placeholderText);
                            $(holdingBlock).find('input').val(userInput);
                        }, 2000);
                    }
                    if (errorStyle == "radioInput"){
                        $(holdingBlock).addClass('registerErrorRadio');
                        setTimeout(function(){
                            $(holdingBlock).removeClass('registerErrorRadio');
                        }, 2000);
                    }
                    if (errorStyle == "selectInput"){
                        $(holdingBlock).addClass('registerErrorSelect');
                        setTimeout(function(){
                            $(holdingBlock).removeClass('registerErrorSelect');
                        }, 2000);
                    }
                }
            }
            checkRegInputs();
        });

        //Login inputs
        let emailLogInput = document.getElementById("emailLogInput");
        let passLogInput = document.getElementById("passLogInput");

        //Log Button
        let logSubmit = document.getElementById("logSubmit");

        logSubmit.addEventListener("click", function(){
            if (emailLogInput.value != "" && passLogInput != ""){
                findAccount(emailLogInput.value, passLogInput.value);
            }
            if(emailLogInput.value == ""){
                $('#logEmail').addClass('inputError');
                $('#emailLogInput').addClass('loginInputError');
                $('#emailLogInput').attr("placeholder", "Empty field");
                setTimeout(function(){
                    $('#logEmail').removeClass('inputError');
                    $('#emailLogInput').removeClass('loginInputError');
                    $('#emailLogInput').attr("placeholder", "Email");
                }, 1000);
            }
            if(passLogInput.value == ""){
                $('#logPassword').addClass('inputError');
                $('#passLogInput').addClass('loginInputError');
                $('#passLogInput').attr("placeholder", "Empty field");
                setTimeout(function(){
                    $('#logPassword').removeClass('inputError');
                    $('#passLogInput').removeClass('loginInputError');
                    $('#passLogInput').attr("placeholder", "Password");
                }, 1000);
            }
        });

        //Finding account
        function findAccount(email, password){
            let accounts = readLocalStorage("accounts");
            let account = accounts.filter(x => x.email == email && x.password == password);
            if (account.length > 0){
                $('#logSubmit').val("SUCCESSFULY LOGGED IN");
                setTimeout(function(){
                    loginUser(account[0]);
                }, 1000);
            }
            else{
                $('#logSubmit').val("WRONG CREDENTIALS");
                $('#logSubmit').addClass('loginError');
                setTimeout(function(){
                    $('#logSubmit').val("LOG IN");
                    $('#logSubmit').removeClass('loginError');
                }, 2000);
            }
        }

        //Logging in
        function loginUser(userAcc){
            saveInLocalStorage(userAcc, "loginStatus");
            window.location.href = "/index.html";
        }

    }
  });