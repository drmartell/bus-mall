import { productsArr } from '../data/products-api.js';
import { getProductById, renderChart } from '../utils/utils.js';

window.onresize = () => { if (imgsSection) setSectionHeight(); };

let consumerView = document.getElementById('top-h2');

const ALL_TIME_KEY = 'allSales';
export const productsArrCopy = productsArr.slice();

const productsIdArr = productsArr.map(product => product.id);
let selectedCountAllArr;
let shownCountAllArr;

let numProducts = 3;
const requiredSelections = 25;

let selectionsMade = 0;

const imgsSection = document.getElementById('imgs-section');
function setSectionHeight() {
    if (imgsSection) imgsSection.style.height = (imgsSection.offsetWidth / 2).toString() + 'px';
} setSectionHeight();
const progressDiv = document.getElementById('progress-text-id');
const resultsSection = document.getElementById('results-section');
const resultsChart = document.getElementById('results-Chart').getContext('2d');
const allPs = document.getElementsByTagName('p');
if (document.getElementById('home-button')) document.getElementById('home-button').addEventListener('click', () => location.href = './');

if (document.getElementById('clear-button')) {
    document.getElementById('clear-button').addEventListener('click', () => {
        localStorage.clear();
        showAggregate();
    });
}

if (consumerView) progressDiv.textContent = `You are on page 1 of ${requiredSelections}`;

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

function showImages() {
    for (let i = 0; i < numProducts; i++) {
        const imgTag = document.createElement('img');
        const thisProduct = getProductById(randomProductsIdsArr[i + numProducts]);
        imgTag.src = thisProduct.imageurl;
        imgTag.alt = thisProduct.name;
        imgTag.id = thisProduct.id;
        imgTag.addEventListener('click', e => handleSelection(e.target.id));
        imgsSection.appendChild(imgTag);
    }
    trimProductsArr();
}

if (consumerView) showImages();

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

function renderResultsList() {
    imgsSection.style.display = 'none';
    const ulTag = document.createElement('ul');
    if (consumerView) {
        resultsSection.appendChild(ulTag);
        document.getElementById('top-h2').textContent = `Thank you!`;
        for (let p of allPs) p.classList.add('hidden');
        productsArrCopy.sort((a, b) => (a.name > b.name) ? 1 : -1);
        for (let i = 0; i < productsArrCopy.length; i++) {
            let thisProduct = productsArrCopy[i];
            if (thisProduct.shownCount) {
                const liTag = document.createElement('li');
                const thisSelectedCount = thisProduct.selectedCount ? thisProduct.selectedCount : 0;
                let selectedPercent = Math.round((thisSelectedCount / thisProduct.shownCount) * 100);
                liTag.innerHTML = `${thisProduct.name.padEnd(10, '.')} shown ${thisProduct.shownCount} times, chosen ${'&nbsp'.repeat(3 - selectedPercent.toString().length) + selectedPercent}% of the time.`;
                ulTag.appendChild(liTag);
            }
        }
        productsArrCopy.sort((a, b) => (a.name > b.name) ? 1 : -1);
        const selectedCountArr = productsArrCopy.map(product => product.selectedCount ? product.selectedCount : 0);
        const shownCountArr = productsArrCopy.map(product => (product.shownCount ? product.shownCount : 0) - (product.selectedCount ? product.selectedCount : 0));
        renderChart(resultsChart, selectedCountArr, shownCountArr);
    }
    else {
        resultsSection.appendChild(ulTag);
        const dataStore = getDataStore();
        dataStore.sort((a, b) => (a.name > b.name) ? 1 : -1);
        for (let i = 0; i < dataStore.length; i++) {
            let thisSavedProduct = dataStore[i];
            if (thisSavedProduct.shownCount) {
                const liTag = document.createElement('li');
                const thisSelectedCount = thisSavedProduct.selectedCount ? thisSavedProduct.selectedCount : 0;
                liTag.textContent = `${thisSavedProduct.name.padEnd(10, '.')} shown ${thisSavedProduct.shownCount} times, chosen ${Math.round((thisSelectedCount / thisSavedProduct.shownCount) * 100).toString().padStart(3)}% of the time.`;
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
    const productsShownArr = productsArrCopy.filter(product => product.shownCount > 0);
    if (dataStore.length === 0) localStorage.setItem(ALL_TIME_KEY, JSON.stringify(productsShownArr));
    else {
        for (let product of productsShownArr) {
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
            }
        }
        localStorage.setItem(ALL_TIME_KEY, JSON.stringify(dataStore));
    }
    prepForDisplay();
}

function prepForDisplay() {
    const dataStore = getDataStore();
    dataStore.sort((a, b) => (a.name > b.name) ? 1 : -1);
    selectedCountAllArr = dataStore.map(product => product.selectedCount ? product.selectedCount : 0);
    shownCountAllArr = dataStore.map(product => (product.shownCount ? product.shownCount : 0) - (product.selectedCount ? product.selectedCount : 0));
}

function showAggregate() {
    renderResultsList();
    if (!consumerView) prepForDisplay();
    renderChart(resultsChart, selectedCountAllArr, shownCountAllArr);
}
if (!consumerView) showAggregate();