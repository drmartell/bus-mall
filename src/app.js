import { productsArr } from '../data/products-api.js';

const ALL_TIME_KEY = 'allSales';
const productsArrCopy = productsArr.slice();

const productsIdArr = productsArr.map(product => product.id);

let numProducts = 5;
const requiredSelections = 3;

let selectionsMade = 0;

const imgsSection = document.getElementById('imgs-section');
const progressDiv = document.getElementById('progress-text-id');

progressDiv.textContent = `You are on page 1 of ${requiredSelections}`;

let randomProductsIdsArr = [];

for (let i = 0; i < numProducts; i++) {
    randomProductsIdsArr.push('');
}

const getRandomId = (max) => Math.ceil(Math.random() * max);

const trimProductsArr = () => randomProductsIdsArr = randomProductsIdsArr.slice(numProducts, numProducts * 2);
function getRandomProducts(numRandomProducts) {
    while (randomProductsIdsArr.length < (numRandomProducts * 2)) {
        let thisRandomId = getRandomId(productsIdArr.length);
        const thisProduct = getProductById(thisRandomId);
        if (!randomProductsIdsArr.includes(thisRandomId)) {
            randomProductsIdsArr.push(thisRandomId);
            thisProduct.shownCount = thisProduct.shownCount ? thisProduct.shownCount + 1 : 1;
        }
    }
} getRandomProducts(numProducts);

function getProductById(productId) {
    for (let product of productsArrCopy)
        if (product.id === productId)
            return product;
}

function showImages() {
    for (let i = 0; i < numProducts; i++) {
        const imgTag = document.createElement('img');
        const thisProduct = getProductById(randomProductsIdsArr[i + numProducts]);
        imgTag.src = thisProduct.imageurl;
        imgTag.alt = thisProduct.name;
        imgTag.id = thisProduct.id;
        imgTag.addEventListener('click', (e) => handleSelection(e.target.id));
        imgsSection.appendChild(imgTag);
    }
    trimProductsArr();
} showImages();

function removeImgTags() {
    imgsSection.innerHTML = '';
}

function handleSelection(imgIdString) {
    selectionsMade++;
    const imgId = Number(imgIdString);
    const thisProduct = getProductById(imgId);
    thisProduct.selectedCount = thisProduct.selectedCount ? thisProduct.selectedCount + 1 : 1;
    if (selectionsMade === requiredSelections) {
        showResults();
    }
    else {
        removeImgTags();
        getRandomProducts(numProducts);
        showImages();
        progressDiv.textContent = `You are on page ${selectionsMade + 1} of ${requiredSelections}`;
    }
}

function showResults() { 
    progressDiv.textContent = `You are on the results page`;
    removeImgTags();
    renderResultsList();
    saveToAllTime();
}

function renderResultsList(alltime = false) {

    const ulTag = document.createElement('ul');
    if (!alltime) {
        imgsSection.appendChild(ulTag);
        productsArrCopy.sort((a, b) => (a.name > b.name) ? 1 : -1);
        for (let i = 0; i < productsArrCopy.length; i++) {
            let thisProduct = productsArrCopy[i];
            if (thisProduct.shownCount) {
                const liTag = document.createElement('li');
                const thisSelectedCount = thisProduct.selectedCount ? thisProduct.selectedCount : 0;
                liTag.textContent = `${thisProduct.name} was show ${thisProduct.shownCount} times, and chosen ${(thisSelectedCount / thisProduct.shownCount) * 100}% of the times it was shown in this round.`;
                ulTag.appendChild(liTag);
            }
        }
    }
    else {
        const h2Tag = document.createElement('h2');
        h2Tag.textContent = `Overall Findings`;
        imgsSection.appendChild(h2Tag);
        imgsSection.appendChild(ulTag);
        const dataStore = getDataStore();
        dataStore.sort((a, b) => (a.name > b.name) ? 1 : -1);
        for (let i = 0; i < dataStore.length; i++) {
            let thisSavedProduct = dataStore[i];
            if (thisSavedProduct.shownCount) {
                const liTag = document.createElement('li');
                const thisSelectedCount = thisSavedProduct.selectedCount ? thisSavedProduct.selectedCount : 0;
                liTag.textContent = `${thisSavedProduct.name} was show ${thisSavedProduct.shownCount} times, and chosen ${(thisSelectedCount / thisSavedProduct.shownCount) * 100}% of the times it was shown overall.`;
                ulTag.appendChild(liTag);
            }
        }
    }
}

function getDataStore() {
    if (!localStorage.getItem(ALL_TIME_KEY)) localStorage.setItem(ALL_TIME_KEY, '[]');
    return JSON.parse(localStorage.getItem(ALL_TIME_KEY));
}

function saveToAllTime() {
    const dataStore = getDataStore();
    const productsShown = productsArrCopy.filter(product => product.shownCount > 0);
    if (dataStore.length === 0) localStorage.setItem(ALL_TIME_KEY, JSON.stringify(productsShown));
    else {
        for (let product of productsShown) {
            let productInDataStore = false;
            for (let storedProduct of dataStore) {
                if (product.id === storedProduct.id) {
                    storedProduct.shownCount += product.shownCount;
                    storedProduct.selectedCount += product.selectedCount;
                    productInDataStore = true;
                    break;
                }
            }
            if (!productInDataStore) {
                dataStore.push(product);
                localStorage.setItem(ALL_TIME_KEY, JSON.stringify(dataStore));
            }
        }
    }
    renderResultsList(true);
}
