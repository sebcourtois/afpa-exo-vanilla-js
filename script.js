let item_counter = localStorage.getItem("item_counter");
item_counter = (item_counter === null) ? 0 : parseInt(item_counter);

function getItemIndex() {
    item_counter++;
    localStorage.setItem("item_counter", item_counter.toString());
    return item_counter;
}

const CURRENT_PAGE_INDEX = parseInt(document.body.dataset.pageIndex);

function makeItemElem(itemData) {
    const targetPageIdx = (itemData.page_index === 1) ? 2 : 1;
    const item_html = `
<article class="item" id=${itemData.id}>
    <div class="item-data">
        <h2>${itemData.label}</h2>
        <p>${itemData.text}</p>
    </div>
    <form class="item-editor" hidden>
        <input class="item-field-editor" type="text" name="item_label_editor">
        <textarea class="item-field-editor" name="item_text_editor"></textarea>
    </form>
    <button class="edit-button" data-item-id="${itemData.id}">Edit</button>
    <button class="removal-button" data-item-id="${itemData.id}">Delete</button>
    <button class="move-button" data-item-id="${itemData.id}" data-target-page-index="${targetPageIdx}">
    To Page ${targetPageIdx}
    </button>
</article>
    `.trim();
    const item_template = document.createElement("template");
    item_template.innerHTML = item_html;
    return item_template.content.firstElementChild;
}

function appendItemElem(itemElem, parentElem) {
    parentElem.appendChild(itemElem);

    const removalButton = itemElem.querySelector(".removal-button");
    removalButton.addEventListener("click", onRemoveButtonClicked);

    const moveButton = itemElem.querySelector(".move-button");
    moveButton.addEventListener("click", onMoveButtonClicked);
}

function loadItemsDb() {
    const itemsDbJson = localStorage.getItem("items_db");
    const itemsDbValues = itemsDbJson === null ? [] : JSON.parse(itemsDbJson);
    return new Map(itemsDbValues.map((itm) => [itm.id, itm]));
}

function saveItemsDb() {
    localStorage.setItem("items_db", JSON.stringify(Array.from(ITEMS_DB.values())));
}

const itemsGroupElem = document.querySelector("#items_group");

const ITEMS_DB = loadItemsDb();
console.log(ITEMS_DB);
for (let itemData of ITEMS_DB.values()) {
    if (itemData.page_index !== CURRENT_PAGE_INDEX) continue;
    const itemElem = makeItemElem(itemData);
    appendItemElem(itemElem, itemsGroupElem);
}

function onMoveButtonClicked(event) {
    const clickedButton = event.target;
    const targetPageIndex = parseInt(clickedButton.dataset.targetPageIndex);
    const clickedItem = ITEMS_DB.get(clickedButton.dataset.itemId);
    clickedItem.page_index = targetPageIndex;
    saveItemsDb();
    removeItemElement(clickedItem.id);
}

function removeItemElement(itemId) {
    const itemElem = document.getElementById(itemId);
    if (itemElem !== null) {
        itemElem.remove();
    }
    return itemElem;
}

function onRemoveButtonClicked(event) {
    const clickedButton = event.target;
    const itemId = clickedButton.dataset.itemId;
    if (ITEMS_DB.has(itemId)) {
        ITEMS_DB.delete(itemId);
        saveItemsDb();
    }
    removeItemElement(itemId);
}

function onAddItemClicked(event) {
    const itemIdx = getItemIndex();
    const itemData = {
        id: `item_${itemIdx}`,
        label: `New Item ${itemIdx}`,
        text: `New Item ${itemIdx} is Awesome`,
        page_index: CURRENT_PAGE_INDEX,
    };

    ITEMS_DB.set(itemData.id, itemData);
    saveItemsDb();

    const itemElem = makeItemElem(itemData);
    appendItemElem(itemElem, itemsGroupElem);
}

const addItemBtn = document.querySelector("#add_item_button");
addItemBtn.addEventListener("click", onAddItemClicked);

