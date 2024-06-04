var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var items = document.querySelectorAll(".payment-item");
var submitButton = document.querySelector(".submit-btn");
var closeBtn = document.querySelector(".close-btn");
var checkedButtons = document.querySelectorAll(".checked-btn");
var modal = document.querySelector(".modal");
var inputName = document.querySelector(".name");
var inputCardNum = document.querySelector(".card-num");
var inputCVV = document.querySelector(".cvv");
var expiration = document.querySelector(".expire");
var editButton = document.querySelector(".edit-btn");
var inputCardText = document.querySelector(".input-num");
var inputNameText = document.querySelector(".input-name");
var inputExpirationText = document.querySelector(".input-expiration");
var arrOfCards = [];
var isEdit = false;
var isOpenModal = false;
var isOpenCardData = false;
var icons = {
    4: "icons/visa-svgrepo-com.svg",
    5: "icons/mastercard-svgrepo-com.svg",
    3: "icons/american-express-svgrepo-com.svg",
};
function addCard(item) {
    var cards = getCards();
    cards.push(item);
    setCards(cards);
}
function setCards(cards) {
    localStorage.setItem("cards", JSON.stringify(cards));
}
function getCards() {
    var storedCardsString = localStorage.getItem("cards");
    var storedCards = storedCardsString ? JSON.parse(storedCardsString) : [];
    return storedCards;
}
function setActive(id) {
    var cards = getCards();
    var activeCards = cards.map(function (item) {
        if (id === item.id) {
            return __assign(__assign({}, item), { iconSrc: "icons/checked-svgrepo-com.svg", isActive: true });
        }
        else {
            return __assign(__assign({}, item), { iconSrc: "icons/checked-radio-svgrepo-com.svg", isActive: false });
        }
    });
    setCards(activeCards);
    showItems();
}
function addNewCard(e) {
    e.preventDefault();
    if (!inputCVV.value ||
        !inputCardNum.value ||
        inputCardNum.value.length != 19 ||
        !inputName.value ||
        !expiration.value) {
        alert("Complete fields");
        return;
    }
    var newCard = {
        id: Date.now(),
        name: inputName.value,
        cardNumber: inputCardNum.value,
        expiration: expiration.value,
        cvv: parseInt(inputCVV.value),
        iconSrc: "icons/checked-radio-svgrepo-com.svg",
        isActive: false,
    };
    inputName.value = "";
    inputCardNum.value = "";
    expiration.value = "";
    inputCVV.value = "";
    inputExpirationText.textContent = "";
    inputCardText.textContent = "";
    inputNameText.textContent = "";
    addCard(newCard);
    closeModal(e);
    showItems();
}
function openModal() {
    isOpenModal = true;
    modal.classList.remove("hidden");
}
function closeModal(e) {
    e.preventDefault();
    isOpenModal = false;
    modal.classList.add("hidden");
}
function deleteItem(id) {
    var cards = getCards();
    var filteredCards = cards.filter(function (item) { return item.id !== id; });
    setCards(filteredCards);
    showItems();
}
function showInfo(cardNumber, cardCvv, cardExpiration, cardName) {
    var holderNum = document.querySelector(".card-holder-num");
    var holderName = document.querySelector(".card-holder-name");
    var holderExpiration = document.querySelector(".card-holder-expiration");
    var holderCvv = document.querySelector(".card-holder-cvv");
    holderCvv.textContent = cardCvv.toString();
    holderName.textContent = cardName;
    holderExpiration.textContent = cardExpiration;
    holderNum.textContent = cardNumber;
    var infoModal = document.querySelector(".info-modal");
    infoModal === null || infoModal === void 0 ? void 0 : infoModal.classList.remove("hidden");
    var infoCloseBtn = document.querySelector(".info-close-btn");
    infoCloseBtn.addEventListener("click", function () {
        infoModal === null || infoModal === void 0 ? void 0 : infoModal.classList.add("hidden");
    });
}
function flipCard() {
    var card = document.getElementById("card");
    card.classList.toggle("flipped");
}
function showItems() {
    var list = document.querySelector(".payment-methods");
    var cards = getCards();
    list.innerHTML = cards
        .map(function (card) {
        return "<li class=\"payment-item ".concat(card.isActive ? "active" : "", "\">\n            <div class=\"card-info\" onclick=\"showInfo('").concat(card.cardNumber, "', '").concat(card.cvv, "', '").concat(card.expiration, "', '").concat(card.name, "')\">\n              <div class=\"card-type\">\n                <img src=\"").concat(icons[card.cardNumber[0]]
            ? icons[card.cardNumber[0]]
            : "icons/visa-svgrepo-com.svg", "\" alt=\"visa-logo\" />\n                <p>XXXX XXXX XXXX ").concat(card.cardNumber.slice(15, 19), "</p>\n              </div>\n              <div class=\"card-details\">\n                <p>Expiries</p>\n                <p>").concat(card.expiration, "</p>\n                <p>").concat(card.name, "</p>\n              </div>\n              ").concat(card.isActive ? "<p class=\"default\">Default</p>" : "", "\n                \n            </div>\n            ").concat(isEdit
            ? "<img\n                    class=\"checked-icon\"\n                    src=\"icons/minus-circle-svgrepo-com.svg\"\n                    alt=\"checked\"\n                    onclick=\"deleteItem(".concat(card.id, ")\"\n                  />")
            : "<img\n                  class=\"checked-icon\"\n                  src=\"".concat(card.iconSrc, "\"\n                  alt=\"checked\"\n                  onclick=\"setActive(").concat(card.id, ")\"\n                />"), "\n          </li>");
    })
        .join("");
}
inputCardNum.addEventListener("input", function (e) {
    var value = e.target.value.replace(/\s/g, "");
    var str = value.replace(/\D/g, "").substring(0, 16);
    str = str.replace(/(\d{4})(?=\d{4})/g, "$1 ");
    inputCardNum.value = str;
    inputCardText.textContent = str;
});
inputName.addEventListener("input", function (e) {
    var value = e.target.value;
    inputNameText.textContent = value;
});
expiration.addEventListener("input", function (e) {
    var value = e.target.value;
    inputExpirationText.textContent = value.toString();
});
editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener("click", function () {
    isEdit = !isEdit;
    showItems();
});
submitButton.addEventListener("click", function (e) { return addNewCard(e); });
closeBtn.addEventListener("click", function (e) { return closeModal(e); });
showItems();
