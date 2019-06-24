$("document").ready(function() {

AddStockListener();
RemoveStockListener();
ViewResultModal();
OpenSearchBox();
favoriteCardColors();

var modalElement = getModalElements();

// function to call use AJAX to sumbit the stock to the backend to get data
function AddStockListener() {

    var addStockForms = document.querySelectorAll('.stock-add');

    const addStockHandler = function(e) {

        e.preventDefault();
        let notification = document.querySelector('.alert-success');
        modalElement.removeAlert.style.display = "none";
        notification.style.display="block";

        modalElement.addButton.classList.remove('is-visible');
        modalElement.removeButton.classList.remove('is-hidden');
        modalElement.addButton.classList.add('is-hidden');
        modalElement.removeButton.classList.add('is-visible');
    
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
function RemoveStockListener() {

    var removeStockForms = document.querySelectorAll('.stock-remove');
    const removeStockHandler = function(e) {


        e.preventDefault();

        modalElement.addAlert.style.display = "none";

        if(!document.querySelector('.c-favorite_card')) {
            modalElement.addButton.classList.remove('is-hidden');
            modalElement.addButton.classList.add('is-visible');
        }
        modalElement.removeButton.classList.remove('is-visible');
        modalElement.removeButton.classList.add('is-hidden');

        let alert = document.querySelector('.alert-danger');
        alert.style.display = "block";
        let stock = e.target.querySelector('.c-stock-input-remove').value


        let favoriteCard = document.querySelector('[data-symbol="' + stock + '"]');
        favoriteCard.parentElement.remove();
        console.log(favoriteCard);
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
        stats: {
            modalStockName:    document.querySelector('.modal-stock-name'),
            modalStockMarket:  document.querySelector('.modal-stock-market'),
            modalStockPercent: document.querySelector('.modal-stock-percent'),
            modalPrice:        document.querySelector('.modal-stock-price'),
            modalTitle:        document.querySelector('.modal-title'),
            modalStockName:    document.querySelector('.modal-stock-name'),
            modalStockMarket:  document.querySelector('.modal-stock-market'),
            modalStockPercent: document.querySelector('.modal-stock-percent'),
            modalPrice:        document.querySelector('.modal-stock-price'),
            yearHighStat:      document.querySelector('.stock-stats-stat-year-high'),
            yearLowStat:       document.querySelector('.stock-stats-stat-year-low'),
            dayHighStat:       document.querySelector('.stock-stats-stat-day-high'),
            dayLowStat:        document.querySelector('.stock-stats-stat-day-low'),
        },
        removeInput:       document.querySelector('.c-stock-input-remove'),
        removeButton:      document.querySelector('.modal-remove-button'),
        addInput:          document.querySelector('.c-stock-input-add'),
        addButton:         document.querySelector('.modal-add-button'),
        spinner:           document.querySelector('.spinner-border'),
        removeAlert:       document.querySelector('.modal-alert.alert-danger'),
        addAlert:          document.querySelector('.modal-alert.alert-success'),
        stocksBar:         document.querySelector('.modal-stock-stats-bar'),
  
    };

    return modalElement;
}


function ViewResultModal() {

    var viewForms = document.querySelectorAll('.stock-view');

    let ViewStockHandler = function(e) {

        e.preventDefault();
        console.log("poopy");
        modalElement = getModalElements();  
    
        modalElement.stocksBar.style.display = "none";
    
        modalElement.stats.modalPrice.textContent = "";
        modalElement.stats.modalTitle.textContent = "";
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
        modalElement.stats.modalTitle.textContent     = body['symbol'];
        modalElement.stats.modalStockName.textContent = body['name'];
        modalElement.stats.modalPrice.textContent     = body['price'];
        modalElement.stats.yearHighStat.textContent   = body['52_week_high'];   
        modalElement.stats.yearLowStat.textContent    = body['52_week_low'];   
        modalElement.stats.dayLowStat.textContent     = body['day_low'];
        modalElement.stats.dayHighStat.textContent    = body['day_high'];
        
        modalElement.stocksBar.style.display    = "block";
        if(body['change_pct']) {
            changePercentage = parseFloat(body['change_pct']);

            let color = determinePercent(changePercentage);
            
            modalElement.stats.modalStockPercent.style.color  = color;
            modalElement.stats.modalStockPercent.textContent  = body['change_pct'];
            
        }
        modalElement.stats.modalStockMarket.textContent   = body['stock_exchange_long'];
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

// return green or red of percentage
function determinePercent(percentage) {

    let color = "";

    if(percentage >= 0) {
        color = "green";
    }
    else {
        color ="red";
    }

    return color;
}

function favoriteCardColors() {

    let percentChange = document.querySelectorAll('.c-favorite_card-percent');

    console.log(percentChange);

    percentChange = Array.prototype.slice.call(percentChange).map(percent => {

        let percentText = percent.textContent;
        let percentNum = parseFloat(percentText);
        let color = determinePercent(percentNum);
        percent.style.color = color;

    });

}

function OpenSearchBox() {

    let addButton       = document.querySelector('.c-favorite_add-button'),
        buttonContainer = document.querySelector('.c-favorite_add-circle'),
        searchContainer = document.querySelector('.c-favorite_search-container');
        searchInput     = document.querySelector('.c-header_form input');

        //console.log(input);
    var openSearch = function() {
        addButton.classList.add('is-hidden');
        addButton.classList.remove('is-visible');
        searchContainer.classList.remove('is-hidden');
        searchContainer.classList.add('is-expanded');
        searchInput.focus();

    }

    if(addButton) {
        addButton.addEventListener('click', openSearch);
    }
}

favoriteCardListener();
function favoriteCardListener() {

    let cards = document.querySelectorAll('.c-favorite_card');

    [].forEach.call(cards,function(em) {
        em.addEventListener('click', function(e) {
            e.preventDefault();

            let ViewStockHandler = function(e) {

                e.preventDefault();
                console.log("poopy");
                modalElement = getModalElements();  
            
                modalElement.stocksBar.style.display = "none";
            
                modalElement.stats.modalPrice.textContent = "";
                modalElement.stats.modalTitle.textContent = "";
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
            
            if(e.currentTarget.id === 'c-favorite_card') {

                console.log(e.currentTarget);

                let form = e.currentTarget.querySelector('.stock-view');
                console.log(form);
                form.dispatchEvent(new Event('submit'));
            }
        });
    });


}

//Removal of styling/data when the 'view' modal is closed
$('#viewModal').on('hidden.bs.modal', function(e) {

    //remove visible styles so that they can be determined on modal popup
    modalElement.removeButton.classList.remove('is-visible');
    modalElement.removeButton.classList.add('is-hidden');
    modalElement.addButton.classList.remove('is-visible');
    modalElement.addButton.classList.add('.is-hidden');
    modalElement.addAlert.style.display = "none";
    modalElement.removeAlert.style.display = "none";

    for( var key in modalElement.stats) {
       
        console.log("made it here");
        modalElement.stats[key].textContent = "";
    }

});
});