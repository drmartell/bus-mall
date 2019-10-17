import { productsArr } from '../data/products-api.js';
import { productsArrCopy } from '../src/app.js';

export function getProductById(productId) {
    for (let product of productsArrCopy)
        if (product.id === productId)
            return product;
        else return productsArrCopy[0];
}

const myLabels = productsArr.map(product => product.name);

export function renderChart(thisResultsChart, thisSelectedCountArr, thisShownCountArr) {
    new Chart(thisResultsChart, {
        type: 'horizontalBar',
        data: {
            labels: myLabels,
            
            datasets: [{
                label: 'User Selected',
                data: thisSelectedCountArr,
                backgroundColor: 'purple',
                hoverBackgroundColor: 'purple',
            }, {
                label: 'Presented To User',
                data: thisShownCountArr,
                backgroundColor: 'orange',
                hoverBackgroundColor: 'orange',
            }]
        },
    
        options: {
            tooltips: {
                enabled: false
            },
            hover :{
                animationDuration:0
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize: 14
                    },
                    scaleLabel:{
                        display: false
                    },
                    gridLines: {
                    }, 
                    stacked: true
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
                        color: '#fff',
                        zeroLineColor: '#fff',
                        zeroLineWidth: 0
                    },
                    ticks: {
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize: 14
                    },
                    stacked: true
                }]
            },
            legend:{
                display: true
            },
            pointLabelFontFamily : 'Quadon Extra Bold',
            scaleFontFamily : 'Quadon Extra Bold',
        },
    });
}