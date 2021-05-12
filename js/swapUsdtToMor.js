function maxusdt(){
    document.getElementById("mor_usdt_in2").value = balanceUSDT;
    document.getElementById("formUsdtToSend").value = balanceUSDT;
    document.getElementById("mor_usdt_out2").value = balanceUSDT*rate_UsdtToMor;
    
};

function swap_usdt_to_mor(){
    document.getElementById("mor_usdt_in2").value = (document.getElementById("mor_usdt_out2").value*rate_UsdtToMor).toFixed(2);
    document.getElementById("formUsdtToSend").value = document.getElementById("mor_usdt_out2").value
    
    if (document.getElementById("formUsdtToSend").value == 0){
        document.getElementById("swap-button2").innerHTML = "Enter an amount";
        document.getElementById("swap-button2").disabled = true;
        document.getElementById("swap-button2").style.background='#808080';

    }else if(document.getElementById("mor_usdt_out2").value > balanceUSDT){
        document.getElementById("swap-button2").innerHTML = "Insufficient USDT balance"
        document.getElementById("swap-button2").disabled = true;
        document.getElementById("swap-button2").style.background='#808080';
    }else{
        document.getElementById("swap-button2").innerHTML = "Swap";
        document.getElementById("swap-button2").disabled = false;
        document.getElementById("swap-button2").style.background='rgb(33, 114, 229)';
    }
};

const getMORBalance2 = async () => {
    const account = await tronWeb.trx.getAccount(defaultAddress_hex);
    tokens = account.assetV2;

    for (var prop in tokens) {
        if (tokens.hasOwnProperty(prop)) {
            if (tokens[prop].key == MOR_Token_ID){
                document.getElementById("morbalance").innerHTML = tokens[prop].value/100;
                document.getElementById("swap_mor_balance2").innerHTML = "Balance: " + tokens[prop].value/100;
                balanceMOR = tokens[prop].value/100;
            }
        }
    }
};

const getUSDTBalance2 = async () => {

    const { abi } = await tronWeb.trx.getContract(usdt_contract);

    const contract = await tronWeb.contract(abi.entrys, usdt_contract);

    const balance = await contract.methods.balanceOf(defaultAddress_hex).call();
    const decimals = await contract.methods.decimals().call()
    balanceUSDT = balance/1000000;
    
    document.getElementById("swap_usdt_balance2").innerHTML = "Balance: " + balanceUSDT;

};

$(document).ready(function () {
    $('.swap-button2').click(async function (e) {

        document.getElementById("formResult2").innerHTML = "";
        document.getElementById("swap-button2").innerHTML = '<div class="loader"></div>&nbsp;Swap in progress, please wait...'
        document.getElementById("swap-button2").disabled = true;
        document.getElementById("swap-button2").style.background='#808080';

        connectWallet();

        //console.log(t_walletBw, bwLimit);

        /*if (t_walletBw < bwLimit || t_walletEnergy < energyLimit){
            document.getElementById("formResult2").innerHTML = "Not enough bandwidth or energy in the treasury wallet. Please contact admin to fix it and try again";
            swapButtonToSwap2();
        }else */if ($('.formUsdtToSend').val() > balanceUSDTT){
            document.getElementById("formResult2").innerHTML = "Not enough USDT balance in the treasury wallet. Please contact admin to fix it and try again";
            swapButtonToSwap2();
        }else{
            //console.log(walletBw, bwLimit);
            if (false == true /*walletEnergy < energyLimit || walletBw < bwLimit*/){
                document.getElementById("formResult2").innerHTML = "You need at least " + bwLimit + " bandwidth and " + energyLimit + " energy for swap";
                swapButtonToSwap2();
            }else{
                if (document.getElementById("formUsdtToSend").value > maxUsdtToSend){
                    document.getElementById("formResult2").innerHTML = "The USDT amount to be sent must be less than " + maxUsdtToSend;
                    swapButtonToSwap2();
                }else{
                    var txid;
                    var sendTokenStatus = true;
                    try {
                        const { abi } = await tronWeb.trx.getContract(usdt_contract);
                        const contract = await tronWeb.contract(abi.entrys, usdt_contract);
                        const result = await contract.methods.transfer(swap_address, (document.getElementById("formUsdtToSend").value*1000000).toFixed(0)).send();
                        //console.log(result);
                        txid = result;
                        getTxStatus(txid);
                    } catch (e) {
                        sendTokenStatus = false;
                        document.getElementById("formResult2").innerHTML = e;
                        swapButtonToSwap2();
                        //console.log('Error', e);
                    } 
                    e.preventDefault();

                    if (sendTokenStatus){
                        var formAction = $('.formAction2').val();
                        var formUsdtToSend = $('.formUsdtToSend').val();
                        var formUsdtSender = $('.formUsdtSender').val();
                        $.ajax
                            ({
                            type: "POST",
                            dataType:'json',
                            url: "swap.php",
                            data: { 
                                "formAction": formAction, 
                                "formUsdtToSend": formUsdtToSend,
                                "txid": txid,
                                "formUsdtSender": formUsdtSender
                            },
                            success: function (data) {
                                document.getElementById("swap-button2").innerHTML = "Enter an amount";
                                document.getElementById("swap-button2").disabled = true;
                                document.getElementById("swap-button2").style.background='#808080';
                                connectWallet();
                                $('.TronLinkMessage2').html("Swap completed successfully!");
                                document.getElementById("TronLinkMessage2").style.visibility = "visible";
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                document.getElementById("formResult2").innerHTML = xhr.responseText;
                                swapButtonToSwap2();
                            }
                        });
                    }
                }
            }
        }
    });
});
                  
                