$("document").ready(function() {

addStockListener();
removeStockListener();
ViewResultModal();
var modalElement = getModalElements();

// function to call use AJAX to sumbit the stock to the backend to get data
function addStockListener() {

    var addStockForms = document.querySelectorAll('.stock-add');

    const addStockHandler = function(e) {
        e.preventDefault();
        let notification = document.querySelector('.alert-success');
        notification.style.display="block";

        stock = e.target.querySelector('.c-stock-input-add').value;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/addStock");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"Stock": stock}));

    };

    [].forEach.call(addStockForms,function(em) {
        em.addEventListener('submit', addStockHandler);
    });

}


//Listener to POST remove data to server
function removeStockListener() {

    var removeStockForms = document.querySelectorAll('.stock-remove');
    const removeStockHandler = function(e) {
        e.preventDefault();

        let alert = document.querySelector('.alert-danger');
        alert.style.display = "block";
        let stock = e.target.querySelector('.c-stock-input-remove').value;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/removeStock");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"Stock": stock}));

    };

    [].forEach.call(removeStockForms,function(em) {
        em.addEventListener('submit', removeStockHandler);
    });

}


function getModalElements() {

    let modalElement = {
        removeInput:       document.querySelector('.c-stock-input-remove'),
        removeButton:      document.querySelector('.stock-remove'),
        addInput:          document.querySelector('.c-stock-input-add'),
        addButton:         document.querySelector('.stock-add'),
        spinner:           document.querySelector('.spinner-border'),
        modalTitle:        document.querySelector('.modal-title'),
        modalStockName:    document.querySelector('.modal-stock-name'),
        modalStockMarket:  document.querySelector('.modal-stock-market'),
        modalStockPercent: document.querySelector('.modal-stock-percent'),
        modalPrice:        document.querySelector('.modal-stock-price'),
        removeAlert:       document.querySelector('.modal-alert.alert-danger'),
        addAlert:          document.querySelector('.modal-alert.alert-success'),
        stocksBar:         document.querySelector('.modal-stock-stats-bar'),
        yearHighHeader:    document.querySelector('.stock-stats-header-year-high'),
        yearHighStat:      document.querySelector('.stock-stats-stat-year-high'),
        yearLowHeader:     document.querySelector('.stock-stats-header-year-low'),
        yearLowStat:       document.querySelector('.stock-stats-stat-year-low'),
  
    };

    return modalElement;
}

function ViewResultModal() {

    var viewForms = document.querySelectorAll('.stock-view');

    const ViewStockHandler = function(e) {
        
        e.preventDefault();

        modalElement.removeButton.classList.remove('is-visible');
        modalElement.removeButton.classList.add('is-hidden');
        modalElement.stocksBar.style.display = "none";

        modalElement.modalPrice.textContent = "";
        modalElement.modalTitle.textContent = "";
        modalElement.spinner.style.display = "block";
        
        stock = e.target.querySelector('.c-stock-input').value;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/viewStock");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"Stock": stock}));

        xmlhttp.onload = function () {

            if(xmlhttp.status === 200) {
                console.log(xmlhttp.response);
                PopulateModal(xmlhttp.response);
            
            }

        };
    };

    [].forEach.call(viewForms,function(em) {
        em.addEventListener('submit', ViewStockHandler);
    });

}

//Method that populates the View Modal with the data AJAX'd in from the ViewResultModal function
function PopulateModal(body) {
    
    body  = JSON.parse(body);

    modalElement.removeButton.classList.remove('is-visible');
    modalElement.spinner.style.display = "none";
    
    if(body) {
        //section to populate the values of the modal
        modalElement.addInput.value             = body['symbol'];
        modalElement.removeInput.value          = body['symbol'];
        modalElement.modalTitle.textContent     = body['symbol'];
        modalElement.modalStockName.textContent = body['name'];
        modalElement.modalPrice.textContent     = body['price'];
        modalElement.yearHighHeader.textContent = "52 Week High";
        modalElement.yearHighStat.textContent  = body['52_week_high'];   
        modalElement.yearLowHeader.textContent  = "52 Week Low";
        modalElement.yearLowStat.textContent  = body['52_week_low'];   
        
        modalElement.stocksBar.style.display    = "block";
        if(body['change_pct']) {
            changePercentage = parseFloat(body['change_pct']);
            
            if(changePercentage >= 0) {
                modalElement.modalStockPercent.textContent  = body['change_pct'];
                modalElement.modalStockPercent.style.color  = "green";
            }
            else {
                modalElement.modalStockPercent.textContent = body['change_pct'];
                modalElement.modalStockPercent.style.color = "red";
            }
        }
        modalElement.modalStockMarket.textContent   = body['stock_exchange_long'];
        
        modalElement.addButton.classList.add('is-visible');
    }

    if(body['present']) {
        modalElement.addButton.classList.remove('is-visible');
        modalElement.addButton.classList.add('is-hidden');
        modalElement.removeButton.classList.add('is-visible');
        modalElement.removeButton.classList.remove('is-hidden');
    }
    else {
        modalElement.removeButton.classList.remove('is-visible');
    }


}

//Removal of styling/data when the 'view' modal is closed
$('#viewModal').on('hidden.bs.modal', function(e) {

    //remove visible styles so that they can be determined on modal popup
    modalElement.removeButton.classList.remove('is-visible');
    modalElement.addButton.classList.remove('is-visible');
    modalElement.addAlert.style.display = "none";
    modalElement.removeAlert.style.display = "none";

    for( var key in modalElement) {
        console.log(modalElement[key]);
        modalElement[key].textContent = "";
    }

});
});