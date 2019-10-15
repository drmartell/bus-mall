import { productsArr } from '../data/products-api.js';

const productsArrCopy = productsArr.slice();

const productsIdArr = productsArr.map(product => product.id); // lets see if can work with mutable array of id's only

let numProducts = 3; // will allow for this to be user selected ultimately

let randomProductsIdsArr = [];

for (let i = 0; i < numProducts; i++) {
    randomProductsIdsArr.push(''); // prepopulate array to prevent incrementing of shownCounts of items that wouldn't be shown on initial pass
}

const getRandomId = (max) => Math.ceil(Math.random() * max);

const trimProductsArr = () => randomProductsIdsArr = randomProductsIdsArr.slice(numProducts, numProducts * 2); // remove front half of array to prep for next additions
//I won't need this to remain a function if I call it immediately, not sure yet
function getRandomProducts(numRandomProducts) {
    while (randomProductsIdsArr.length < (numRandomProducts * 2)) { // double this array length to retain the 'prior' set of randoms
        let thisRandomId = getRandomId(productsIdArr.length);
        if (!randomProductsIdsArr.includes(thisRandomId)) {
            randomProductsIdsArr.push(thisRandomId);
            getProductById(thisRandomId).shownCount += 1; // increment number of times shown
        }
    }
} getRandomProducts(numProducts);

console.log(randomProductsIdsArr);

function getProductById(productId) {
    for (let product of productsArrCopy)
        if (product.id === productId)
            return product;
}

const imgsSection = document.getElementById('imgs-section');

function showImages() {
    for (let i = 0; i < numProducts; i++) {
        const imgTag = document.createElement('img');
        const thisProduct = getProductById(randomProductsIdsArr[i + numProducts]);
        console.log(randomProductsIdsArr[i + numProducts]);
        imgTag.src = thisProduct.imageurl;
        imgTag.alt = thisProduct.name;
        imgTag.id = thisProduct.id;
        imgTag.addEventListener('click', (e) => handleSelection(e.target.id));
        imgsSection.appendChild(imgTag);
    }
    console.log(randomProductsIdsArr);
    trimProductsArr();
    console.log(randomProductsIdsArr);
} showImages();

function removeImgTags() {
    imgsSection.innerHTML = '';
}

let selectionsMade = 0; // results displayed after minimum of 25 selections

function handleSelection(imgIdString) {
    alert(`you clicked ${JSON.stringify(getProductById(Number(imgIdString)))}`);
    removeImgTags();
    getRandomProducts(numProducts);
    showImages();
}

