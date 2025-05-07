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
        <h2 class="item-field-value" data-editor-name="item_label_editor">${itemData.label}</h2>
        <input class="item-field-editor hidden" type="text" name="item_label_editor" data-item-field-name="label">
        <p class="item-field-value" data-editor-name="item_text_editor">${itemData.text}</p>
        <textarea class="item-field-editor hidden" name="item_text_editor" data-item-field-name="text"
        rows="4" cols="50"
        ></textarea>
    </div>
    <button class="saving-button hidden" data-item-id="${itemData.id}">Save</button>
    <button class="editing-button" data-item-id="${itemData.id}">Edit</button>
    <button class="page-move-button" data-item-id="${itemData.id}" data-target-page-index="${targetPageIdx}">
    To Page ${targetPageIdx}
    </button>
    <button class="removal-button" data-item-id="${itemData.id}">Delete</button>
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

    const moveButton = itemElem.querySelector(".page-move-button");
    moveButton.addEventListener("click", onMoveButtonClicked);

    const editButton = itemElem.querySelector(".editing-button");
    editButton.addEventListener("click", onEditButtonClicked);

    const saveButton = itemElem.querySelector(".saving-button");
    saveButton.addEventListener("click", onSaveButtonClicked);

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

function onAddItemClicked() {
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

function onEditButtonClicked(event) {
    const editingButton = event.target;
    const itemId = editingButton.dataset.itemId;
    const itemElem = document.getElementById(itemId);

    const savingButton = itemElem.querySelector(".saving-button");
    savingButton.classList.remove("hidden");
    editingButton.classList.add("hidden");

    const fieldElements = itemElem.querySelectorAll(".item-field-value");
    for (let fieldElem of fieldElements) {
        let editorName = fieldElem.getAttribute("data-editor-name");
        if (editorName === undefined) continue;

        let editorElem = itemElem.querySelector(`[name=${editorName}]`);
        if (editorElem === null) continue;

        let fieldValue = fieldElem.textContent;
        if (editorElem instanceof HTMLInputElement) {
            editorElem.value = fieldValue;
        } else {
            editorElem.textContent = fieldValue;
        }
        editorElem.classList.remove("hidden");
        fieldElem.classList.add("hidden");
    }
}

function onSaveButtonClicked(event) {
    const savingButton = event.target;
    const itemId = savingButton.dataset.itemId;
    const itemElem = document.getElementById(itemId);
    const itemData = ITEMS_DB.get(itemId);

    const editorElements = itemElem.querySelectorAll(".item-field-editor");
    for (let editorElem of editorElements) {
        let fieldName = editorElem.getAttribute("data-item-field-name");
        itemData[fieldName] = editorElem.value;
    }
    saveItemsDb();

    const fieldElements = itemElem.querySelectorAll(".item-field-value");
    for (let fieldElem of fieldElements) {
        let editorName = fieldElem.getAttribute("data-editor-name");
        if (editorName === undefined) continue;

        let editorElem = itemElem.querySelector(`[name=${editorName}]`);
        if (editorElem === null) continue;

        let fieldName = editorElem.getAttribute("data-item-field-name");
        fieldElem.textContent = itemData[fieldName];

        editorElem.classList.add("hidden");
        fieldElem.classList.remove("hidden");
    }

    const editingButton = itemElem.querySelector(".editing-button");
    editingButton.classList.remove("hidden");
    savingButton.classList.add("hidden");
}

const addItemBtn = document.querySelector("#add_item_button");
addItemBtn.addEventListener("click", onAddItemClicked);
