type card = {
  id: number;
  name: string;
  cardNumber: string;
  expiration: string;
  cvv: number;
  iconSrc: string;
  isActive: boolean;
};

const items = document.querySelectorAll(
  ".payment-item"
) as NodeListOf<HTMLElement>;

const submitButton = document.querySelector(".submit-btn") as HTMLButtonElement;
const closeBtn = document.querySelector(".close-btn") as HTMLButtonElement;
const checkedButtons = document.querySelectorAll(
  ".checked-btn"
) as NodeListOf<HTMLButtonElement>;

const modal = document.querySelector(".modal") as HTMLElement;

const inputName = document.querySelector(".name") as HTMLInputElement;
const inputCardNum = document.querySelector(".card-num") as HTMLInputElement;
const inputCVV = document.querySelector(".cvv") as HTMLInputElement;
const expiration = document.querySelector(".expire") as HTMLInputElement;

const editButton = document.querySelector(".edit-btn") as HTMLButtonElement;

const inputCardText = document.querySelector(
  ".input-num"
) as HTMLParagraphElement;

const inputNameText = document.querySelector(
  ".input-name"
) as HTMLParagraphElement;

const inputExpirationText = document.querySelector(
  ".input-expiration"
) as HTMLParagraphElement;

let arrOfCards: card[] = [];
let isEdit: boolean = false;
let isOpenModal: boolean = false;
let isOpenCardData: boolean = false;

const icons: object = {
  4: "icons/visa-svgrepo-com.svg",
  5: "icons/mastercard-svgrepo-com.svg",
  3: "icons/american-express-svgrepo-com.svg",
};

function addCard(item: card): void {
  const cards = getCards();
  cards.push(item);
  setCards(cards);
}

function setCards(cards: card[]): void {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function getCards(): card[] {
  const storedCardsString = localStorage.getItem("cards");
  const storedCards = storedCardsString ? JSON.parse(storedCardsString) : [];

  return storedCards;
}

function setActive(id: number): void {
  const cards = getCards();
  const activeCards = cards.map((item) => {
    if (id === item.id) {
      return {
        ...item,
        iconSrc: "icons/checked-svgrepo-com.svg",
        isActive: true,
      };
    } else {
      return {
        ...item,
        iconSrc: "icons/checked-radio-svgrepo-com.svg",
        isActive: false,
      };
    }
  });

  setCards(activeCards);

  showItems();
}

function addNewCard(e: MouseEvent): void {
  e.preventDefault();

  if (
    !inputCVV.value ||
    !inputCardNum.value ||
    inputCardNum.value.length != 19 ||
    !inputName.value ||
    !expiration.value
  ) {
    alert("Complete fields");
    return;
  }

  const newCard: card = {
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

function closeModal(e: MouseEvent) {
  e.preventDefault();

  isOpenModal = false;
  modal.classList.add("hidden");
}

function deleteItem(id: number) {
  const cards = getCards();
  const filteredCards = cards.filter((item) => item.id !== id);
  setCards(filteredCards);
  showItems();
}

function showInfo(
  cardNumber: string,
  cardCvv: number,
  cardExpiration: string,
  cardName: string
): void {
  const holderNum = document.querySelector(".card-holder-num") as HTMLElement;
  const holderName = document.querySelector(".card-holder-name") as HTMLElement;
  const holderExpiration = document.querySelector(
    ".card-holder-expiration"
  ) as HTMLElement;
  const holderCvv = document.querySelector(".card-holder-cvv") as HTMLElement;

  holderCvv.textContent = cardCvv.toString();
  holderName.textContent = cardName;
  holderExpiration.textContent = cardExpiration;
  holderNum.textContent = cardNumber;

  const infoModal = document.querySelector(".info-modal");
  infoModal?.classList.remove("hidden");

  const infoCloseBtn = document.querySelector(
    ".info-close-btn"
  ) as HTMLButtonElement;

  infoCloseBtn.addEventListener("click", () => {
    infoModal?.classList.add("hidden");
  });
}

function flipCard(): void {
  const card = document.getElementById("card") as HTMLElement;
  card.classList.toggle("flipped");
}

function showItems() {
  const list = document.querySelector(".payment-methods") as HTMLUListElement;

  const cards = getCards();

  list.innerHTML = cards
    .map((card: card) => {
      return `<li class="payment-item ${card.isActive ? "active" : ""}">
            <div class="card-info" onclick="showInfo('${card.cardNumber}', '${
        card.cvv
      }', '${card.expiration}', '${card.name}')">
              <div class="card-type">
                <img src="${
                  icons[card.cardNumber[0]]
                    ? icons[card.cardNumber[0]]
                    : "icons/visa-svgrepo-com.svg"
                }" alt="visa-logo" />
                <p>XXXX XXXX XXXX ${card.cardNumber.slice(15, 19)}</p>
              </div>
              <div class="card-details">
                <p>Expiries</p>
                <p>${card.expiration}</p>
                <p>${card.name}</p>
              </div>
              ${card.isActive ? `<p class="default">Default</p>` : ""}
                
            </div>
            ${
              isEdit
                ? `<img
                    class="checked-icon"
                    src="icons/minus-circle-svgrepo-com.svg"
                    alt="checked"
                    onclick="deleteItem(${card.id})"
                  />`
                : `<img
                  class="checked-icon"
                  src="${card.iconSrc}"
                  alt="checked"
                  onclick="setActive(${card.id})"
                />`
            }
          </li>`;
    })
    .join("");
}

inputCardNum.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).value.replace(/\s/g, "");
  let str = value.replace(/\D/g, "").substring(0, 16);
  str = str.replace(/(\d{4})(?=\d{4})/g, "$1 ");

  inputCardNum.value = str;

  inputCardText.textContent = str;
});

inputName.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).value;
  inputNameText.textContent = value;
});

expiration.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).value;
  inputExpirationText.textContent = value.toString();
});

editButton?.addEventListener("click", () => {
  isEdit = !isEdit;
  showItems();
});

submitButton.addEventListener("click", (e) => addNewCard(e));

closeBtn.addEventListener("click", (e) => closeModal(e));

showItems();
