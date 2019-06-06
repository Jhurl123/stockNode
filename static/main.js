$("document").ready(function() {

addStockListener();
removeStockListener();
ViewResultModal();

// function to call the 
function addStockListener() {

    var addStockForms = document.querySelectorAll('.stock-add');

    const addStockHandler = function(e) {
        e.preventDefault();
        let notification = document.querySelector('.alert-success');
        notification.style.display="block";

        stock = e.target.querySelector('.c-stock-input-add').value;
        
        console.log(stock);
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
        let stock = e.target.querySelector('.c-stock-input').value;
        console.log(stock);
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/removeStock");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"Stock": stock}));

    };

    [].forEach.call(removeStockForms,function(em) {
        em.addEventListener('submit', removeStockHandler);
    });

}

function ViewResultModal() {

    var viewForms = document.querySelectorAll('.stock-view');

    const ViewStockHandler = function(e) {
        
        e.preventDefault();

        let removeButton = document.querySelector('.stock-remove');
        let addButton    = document.querySelector('.stock-add');
        let spinner      = document.querySelector('.spinner-border');
        let modalSymbol  = document.querySelector('.modal-stock-symbol');
        let modalTitle   = document.querySelector('.modal-title');

        modalSymbol.textContent = "";
        modalTitle.textContent = "";
        spinner.style.display = "block";
        
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

function PopulateModal(body) {

    
    body         = JSON.parse(body);
    let modal    = document.querySelector('#viewModal'),
    modalTitle   = document.querySelector('.modal-title'),
    modalInput   = document.querySelector('.modal-input'),
    removeButton = document.querySelector('.stock-remove'),
    addButton    = document.querySelector('.stock-add'),
    spinner      = document.querySelector('.spinner-border'),
    addInput     = document.querySelector('.c-stock-input-add'),
    modalSymbol  = document.querySelector('.modal-stock-symbol');

    spinner.style.display = "none";
    
    if(body) {
        addInput.value = body['symbol'];
        addButton.classList.add('is-visible');
        modalTitle.textContent = body['symbol'];
        modalSymbol.textContent = body['percentChange'];
        modalInput.value = body['symbol'];
        
    }

    if(body['present']) {
        console.log(body['present']);
        removeButton.classList.add('is-visible');
        removeButton.classList.remove('is-hidden');
    }
    else {
     
    }


}

function removeClasses() {

}

$('#viewModal').on('hidden.bs.modal', function(e) {

    let removeAlert = document.querySelector('.alert-danger');
    let addAlert = document.querySelector('.alert-success');
    let addButton = document.querySelector('.stock-add');
    addButton.style.display = "none";
    addAlert.style.display = "none";
    removeAlert.style.display = "none";

});
});