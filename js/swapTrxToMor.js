const getTrxMorPrice = async () => {
    const Http = new XMLHttpRequest();
    const url='https://apilist.tronscan.org/api/token/price?token=trx';
    await $.get(url, function(data, status){
        console.log(data.price_in_usd)
        rate_TrxToMor = data.price_in_usd*10
    });
}

function maxtrx(){
    getTrxMorPrice()

    document.getElementById("trx_mor_in").value = balanceTRX_TRX;
    document.getElementById("formTrxToSend").value = balanceTRX_TRX;
    document.getElementById("trx_mor_out").value = balanceTRX_TRX*rate_TrxToMor;
    
};

function swap_trx_to_mor(){
    getTrxMorPrice()

    document.getElementById("trx_mor_out").value = (document.getElementById("trx_mor_in").value*rate_TrxToMor).toFixed(2);
    document.getElementById("formTrxToSend").value = document.getElementById("trx_mor_in").value
    
    if (document.getElementById("formTrxToSend").value == 0){
        document.getElementById("swap-button_trxmor").innerHTML = "Enter an amount";
        document.getElementById("swap-button_trxmor").disabled = true;
        document.getElementById("swap-button_trxmor").style.background='#808080';

    }else if(document.getElementById("trx_mor_in").value > balanceTRX_TRX){
        document.getElementById("swap-button_trxmor").innerHTML = "Insufficient TRX balance"
        document.getElementById("swap-button_trxmor").disabled = true;
        document.getElementById("swap-button_trxmor").style.background='#808080';

    }else{
        document.getElementById("swap-button_trxmor").innerHTML = "Swap";
        document.getElementById("swap-button_trxmor").disabled = false;
        document.getElementById("swap-button_trxmor").style.background='rgb(33, 114, 229)';
    }
};

const getTRXMORBalance = async () => {
    const account = await tronWeb.trx.getAccount(defaultAddress_hex);
    tokens = account.assetV2;

    for (var prop in tokens) {
        if (tokens.hasOwnProperty(prop)) {
            if (tokens[prop].key == MOR_Token_ID){
                document.getElementById("morbalance").innerHTML = tokens[prop].value/100;
                document.getElementById("swap_trx_mor_balance").innerHTML = "Balance: " + tokens[prop].value/100;
                balanceMOR = tokens[prop].value/100;
            }
        }
    }
};

const getTRXTRXBalance = async () => {

    const account = await tronWeb.trx.getAccount(defaultAddress_hex);
    console.log(account);
    balanceTRX_TRX = account.balance/1000000;
    
    document.getElementById("swap_trx_trx_balance").innerHTML = "Balance: " + balanceTRX_TRX;

};

$(document).ready(function () {
    $('.swap-button_trxmor').click(async function (e) {

        document.getElementById("formAction_trxmor").innerHTML = "";
        document.getElementById("swap-button_trxmor").innerHTML = '<div class="loader"></div>&nbsp;Swap in progress, please wait...'
        document.getElementById("swap-button_trxmor").disabled = true;
        document.getElementById("swap-button_trxmor").style.background='#808080';

        connectWallet();

        //console.log(t_walletBw, bwLimit);

        /*if (t_walletBw < bwLimit || t_walletEnergy < energyLimit){
            document.getElementById("formResult2").innerHTML = "Not enough bandwidth or energy in the treasury wallet. Please contact admin to fix it and try again";
            swapButtonToSwap2();
        }else */if ($('.formTrxToSend').val() > balanceTRX_TRX){
            document.getElementById("formAction_trxmor").innerHTML = "Not enough TRX balance in the treasury wallet. Please contact admin to fix it and try again";
            swapButtonToSwap_trxmor();
        }else{
            //console.log(walletBw, bwLimit);
            if (false == true /*walletEnergy < energyLimit || walletBw < bwLimit*/){
                document.getElementById("formAction_trxmor").innerHTML = "You need at least " + bwLimit + " bandwidth and " + energyLimit + " energy for swap";
                swapButtonToSwap_trxmor();
            }else{
                if (document.getElementById("formTrxToSend").value > maxTrxToSend){
                    document.getElementById("formAction_trxmor").innerHTML = "The TRX amount to be sent must be less than " + maxTrxToSend;
                    swapButtonToSwap_trxmor();
                }else{
                    var txid;
                    var sendTokenStatus = true;
                    try {
                        //console.log(document.getElementById("formTrxToSend").value*1000000);
                        const result = await window.tronWeb.trx.sendTrx(swap_address, (document.getElementById("formTrxToSend").value*1000000).toFixed(0));
                        txid = result.txid;
                        getTxStatus(txid);
                    } catch (e) {
                        sendTokenStatus = false;
                        document.getElementById("formResult_trxmor").innerHTML = e;
                        swapButtonToSwap();
                        //console.log('Error', e);
                    } 
                    e.preventDefault();

                    if (sendTokenStatus){
                        var formAction = $('.formAction_trxmor').val();
                        var formTrxToSend = $('.formTrxToSend').val();
                        var formUsdtSender = $('.formTrxSender').val();
                        $.ajax
                            ({
                            type: "POST",
                            dataType:'json',
                            url: "swap.php",
                            data: { 
                                "formAction": formAction, 
                                "formTrxToSend": formTrxToSend,
                                "txid": txid,
                                "formTrxSender": formUsdtSender
                            },
                            success: function (data) {
                                document.getElementById("swap-button_trxmor").innerHTML = "Enter an amount";
                                document.getElementById("swap-button_trxmor").disabled = true;
                                document.getElementById("swap-button_trxmor").style.background='#808080';
                                connectWallet();
                                $('.TronLinkMessageTrx').html("Swap completed successfully!");
                                document.getElementById("TronLinkMessageTrx").style.visibility = "visible";
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                document.getElementById("formResult_trxmor").innerHTML = xhr.responseText;
                                swapButtonToSwap_trxmor();
                            }
                        });
                    }
                }
            }
        }
    });
});
                  
                