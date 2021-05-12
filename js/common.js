var env="testnet";
var rate_morToUsdt;
var swap_address;
var usdt_contract;
var MOR_Token_ID;

//Variables
if (env == "mainnet"){
    rate_morToUsdt = 0.1;
    rate_UsdtToMor = 10;
    rate_TrxToMor = 0;
    swap_address = "TLQ5opig4NSE8JHzwjdkLnCrqeLrn8B2bg";
    usdt_contract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    MOR_Token_ID = 1002357;
    maxMorToSend = 10000;
    maxUsdtToSend = 1000;
    maxTrxToSend = 20000;
    bwLimit = 500;
    energyLimit = 20000;

}else if(env == "testnet"){
    rate_morToUsdt = 0.1;
    rate_UsdtToMor = 10;
    rate_TrxToMor = 0;
    swap_address = "TLQ5opig4NSE8JHzwjdkLnCrqeLrn8B2bg";
    usdt_contract = "TP2u5vg7SWwonmmgeGfjVRMjDwvRb5AQj9";
    MOR_Token_ID = 1000543;
    maxMorToSend = 10000;
    maxUsdtToSend = 1000;
    maxTrxToSend = 20000;
    bwLimit = 500;
    energyLimit = 20000;
}

var defaultAddress_hex = '';
var defaultAddress_base58 = '';
var balanceMOR = 0;
var balanceUSDT = 0;
var balanceMORT = 0;
var balanceUSDTT = 0;
var balanceTRX_MOR = 0;
var balanceTRX_TRX = 0;


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getTxStatus(txid){
    sleep(5000);
    var txResult = window.tronWeb.trx.getTransaction(txid);
};

function switchSwap(){

    var x = document.getElementById("divMorToUsdt");

    if (x.style.visibility === "visible") {
        x.style.visibility = "hidden";
        document.getElementById("divUsdtToMor").style.visibility = "visible";
    }else{
        x.style.visibility = "visible";
        document.getElementById("divUsdtToMor").style.visibility = "hidden";
    }
}

function swapButtonToSwap(){
    document.getElementById("swap-button").innerHTML = "Swap";
    document.getElementById("swap-button").disabled = false;
    document.getElementById("swap-button").style.background='rgb(33, 114, 229)';
}

function swapButtonToSwap2(){
    document.getElementById("swap-button2").innerHTML = "Swap";
    document.getElementById("swap-button2").disabled = false;
    document.getElementById("swap-button2").style.background='rgb(33, 114, 229)';
}

function swapButtonToSwap_trxmor(){
    document.getElementById("swap-button_trxmor").innerHTML = "Swap";
    document.getElementById("swap-button_trxmor").disabled = false;
    document.getElementById("swap-button_trxmor").style.background='rgb(33, 114, 229)';
}

