
function maxmor(){
    document.getElementById("mor_usdt_in").value = balanceMOR;
    document.getElementById("formMorToSend").value = balanceMOR;
    document.getElementById("mor_usdt_out").value = balanceMOR*rate_morToUsdt;
    
};

function swap_mor_to_usdt(){
    document.getElementById("mor_usdt_out").value = (document.getElementById("mor_usdt_in").value*rate_morToUsdt).toFixed(2);
    document.getElementById("formMorToSend").value = document.getElementById("mor_usdt_in").value
    
    if (document.getElementById("formMorToSend").value == 0){
        document.getElementById("swap-button").innerHTML = "Enter an amount";
        document.getElementById("swap-button").disabled = true;
        document.getElementById("swap-button").style.background='#808080';

    }else if(document.getElementById("mor_usdt_in").value > balanceMOR){
        document.getElementById("swap-button").innerHTML = "Insufficient MOR balance"
        document.getElementById("swap-button").disabled = true;
        document.getElementById("swap-button").style.background='#808080';
    }else{
        swapButtonToSwap();
    }
};


const getMORBalance = async () => {
    const account = await tronWeb.trx.getAccount(defaultAddress_hex);
    tokens = account.assetV2;

    for (var prop in tokens) {
        if (tokens.hasOwnProperty(prop)) {
            if (tokens[prop].key == MOR_Token_ID){
                document.getElementById("morbalance").innerHTML = tokens[prop].value/100;
                document.getElementById("swap_morbalance").innerHTML = "Balance: " + tokens[prop].value/100;
                balanceMOR = tokens[prop].value/100;
            }
        }
    }
};

const getUSDTBalance = async () => {

    const { abi } = await tronWeb.trx.getContract(usdt_contract);
    const contract = await tronWeb.contract(abi.entrys, usdt_contract);

    const balance = await contract.methods.balanceOf(defaultAddress_hex).call();
    const decimals = await contract.methods.decimals().call()
    balanceUSDT = balance/1000000;
    
    document.getElementById("swap_usdt_balance").innerHTML = "Balance: " + balanceUSDT;

};
            

$(document).ready(function () {

    $('.swap-button').click(async function (e) {
        document.getElementById("formResult").innerHTML = "";
        document.getElementById("swap-button").innerHTML = '<div class="loader"></div>&nbsp;Swap in progress, please wait...'
        document.getElementById("swap-button").disabled = true;
        document.getElementById("swap-button").style.background = '#808080';

        connectWallet();
        //console.log(t_walletBw, bwLimit);

        /*if (t_walletBw < bwLimit || t_walletEnergy < energyLimit){
            document.getElementById("formResult").innerHTML = "Not enough bandwidth or energy in the treasury wallet. Please contact admin to fix it and try again";
            swapButtonToSwap();
        }else */if ($('.formMorToSend').val() > balanceMORT) {
            document.getElementById("formResult").innerHTML = "Not enough MOR balance in the treasury wallet. Please contact admin to fix it and try again";
            swapButtonToSwap();
        } else {
            //console.log(walletBw, bwLimit);
            if (false == true /*walletBw < bwLimit*/) {
                document.getElementById("formResult").innerHTML = "You need at least " + bwLimit + " bandwidth for swap";
                swapButtonToSwap();
            } else {
                if (document.getElementById("formMorToSend").value > maxMorToSend) {
                    document.getElementById("formResult").innerHTML = "The MOR amount to be sent must be less than " + maxMorToSend;
                    swapButtonToSwap();
                } else {
                    var txid;
                    var sendTokenStatus = true;
                    var howmany = (document.getElementById("formMorToSend").value * 100).toFixed(0);
                    try {
                       
                        //console.log(document.getElementById("formMorToSend").value*100);
                        const result = await tronWeb.trx.sendToken(swap_address, (document.getElementById("formMorToSend").value * 100).toFixed(0), '1002357');
                        txid = result.txid;
                        getTxStatus(txid);
                    } catch (e) {
                        sendTokenStatus = false;
                        document.getElementById("formResult").innerHTML = e;
                        swapButtonToSwap();
                        //console.log('Error', e);
                    } 
                    e.preventDefault();
            
                    if (sendTokenStatus){
                        var formAction = $('.formAction').val();
                        var formMorToSend = $('.formMorToSend').val();
                        $.ajax
                            ({
                            type: "POST",
                            dataType:'json',
                            url: "swap.php",
                            data: { 
                                "formAction": formAction, 
                                "formMorToSend": formMorToSend,
                                "txid": txid
                            },
                            success: function (data) {
                                document.getElementById("swap-button").innerHTML = "Enter an amount";
                                document.getElementById("swap-button").disabled = true;
                                document.getElementById("swap-button").style.background='#808080';
                                connectWallet();
                                $('.TronLinkMessage').html("Swap completed successfully!");
                                document.getElementById("TronLinkMessage").style.visibility = "visible";
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                document.getElementById("formResult").innerHTML = xhr.responseText;
                                swapButtonToSwap();
                            }
                        });
                    }
                }
            }
        }
    });   
});
