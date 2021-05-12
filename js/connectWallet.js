
var walletBw = 0;
var walletEnergy = 0;
var freeNetUsed = 0;
var NetLimit = 0;
var t_walletBw = 0;
var t_walletEnergy = 0;
var t_freeNetUsed = 0;
var t_NetLimit = 0;

async function getWalletBw(adr){
    await window.tronWeb.trx.getAccountResources(adr, (err, response) => {
        if(err)
          return console.error(err);
          //console.log( response);
          if (typeof response.freeNetUsed !== 'undefined'){
            freeNetUsed = response.freeNetUsed;

            if(typeof response.NetLimit !== 'undefined') {
                NetLimit = response.NetLimit;
            }
          }
          //console.log("bw", freeNetUsed, NetLimit);
        walletBw = (response.freeNetLimit-freeNetUsed)+NetLimit;
    });     
}

async function getWalletEnergy(adr){
    await window.tronWeb.trx.getAccountResources(adr, (err, response) => {
        if(err)
          return console.error(err);
          //console.log( response.EnergyLimit);
          if (typeof response.EnergyLimit !== 'undefined') {
            //console.log( response);
            //console.log( response.EnergyLimit);
            walletEnergy = response.EnergyLimit;
          }
    });    
}   

async function getTBw(adr){
    await window.tronWeb.trx.getAccountResources(adr, (err, response) => {
        if(err)
          return console.error(err);
          //console.log( response);
          if (typeof response.freeNetUsed !== 'undefined'){
            t_freeNetUsed = response.freeNetUsed;

            if(typeof response.NetLimit !== 'undefined') {
                t_NetLimit = response.NetLimit;
            }
          }
          //console.log("bw", freeNetUsed, NetLimit);
          t_walletBw = (response.freeNetLimit-t_freeNetUsed)+t_NetLimit;
    });     
}

async function getTEnergy(adr){
    await window.tronWeb.trx.getAccountResources(adr, (err, response) => {
        if(err)
          return console.error(err);
          //console.log( response.EnergyLimit);
          if (typeof response.EnergyLimit !== 'undefined') {
            //console.log( response);
            //console.log( response.EnergyLimit);
            t_walletEnergy = response.EnergyLimit;
          }
    });    
}

function connectWallet(){

    if (typeof window.tronWeb !== 'undefined') {
        account = window.tronWeb.defaultAddress;
        if (account.hex != false){
            defaultAddress_hex = account.hex;
            defaultAddress_base58 = account.base58;

            if (document.getElementById("TronLinkMessage") != null){
                document.getElementById("TronLinkMessage").style.visibility = "hidden";
                getMORBalance();
                getUSDTBalance();
                getMORBalance2();
                getUSDTBalance2();
                getMORBalanceT();
                getUSDTBalanceT();
            }

            if (document.getElementById("TronLinkMessageTrx") != null){
                document.getElementById("TronLinkMessageTrx").style.visibility = "hidden";
                getTRXMORBalance();
                getTRXTRXBalance();
            }
            
            getWalletBw(defaultAddress_hex);
            getWalletEnergy(defaultAddress_hex);
            getTBw(swap_address);
            getTEnergy(swap_address);
            //console.log(walletBw);
            //console.log(walletEnergy);
        }else{
            if (document.getElementById("TronLinkMessage") != null){
                document.getElementById("TronLinkMessage").style.visibility = "visible";
                TronLinkMessage.innerHTML = 'Please unlock TronLink. ';
            }

            if (document.getElementById("TronLinkMessageTrx") != null){
                document.getElementById("TronLinkMessageTrx").style.visibility = "visible";
                TronLinkMessage.innerHTML = 'Please unlock TronLink. ';
            }
            
        }
        
    }else{
        if (document.getElementById("TronLinkMessage") != null){
            document.getElementById("TronLinkMessage").style.visibility = "visible";
            TronLinkMessage.innerHTML = 'TronLink not installed. ';
        }
        if (document.getElementById("TronLinkMessageTrx") != null){
            document.getElementById("TronLinkMessageTrx").style.visibility = "visible";
            TronLinkMessage.innerHTML = 'TronLink not installed. ';
        }
    }

    if (typeof defaultAddress_base58 != '' && defaultAddress_base58 != false) {
        if (document.getElementById("TronLinkMessage") != null){
            document.getElementById("walletaddress").innerHTML = defaultAddress_base58.substring(0, 4)+"..."+defaultAddress_base58.substring(30, 34);
            document.getElementById("formUsdtSender").value = defaultAddress_hex;
        }
        if (document.getElementById("TronLinkMessageTrx") != null){
            document.getElementById("walletaddress").innerHTML = defaultAddress_base58.substring(0, 4)+"..."+defaultAddress_base58.substring(30, 34);
            document.getElementById("formTrxSender").value = defaultAddress_hex;
        }
    }else{
        document.getElementById("walletaddress").innerHTML = 'Connect to a wallet';
    }
};

function getBw($arrayRess){
    $freeNetUsed = 0;
    $NetLimit = 0;

    if (isset($arrayRess['freeNetUsed'])){
        $freeNetUsed = $arrayRess['freeNetUsed'];

        if(isset($arrayRess['NetLimit'])) {
            $NetLimit = $arrayRess['NetLimit'];
        }
    }
    
    $walletBw = ($arrayRess['freeNetLimit']-$freeNetUsed) + $NetLimit;
    //echo("\nbw ".$freeNetUsed." ".$NetLimit." ".$arrayRess['freeNetLimit']." ".$walletBw);
    return $walletBw;
}

function getEnergy($arrayRess){
    $walletEnergy = 0;
    if (isset($arrayRess['EnergyLimit'])) {
        //console.log( response);
        //console.log( response.EnergyLimit);
        $walletEnergy = $arrayRess['EnergyLimit'];
    }
    //echo("\nenergy ".$walletEnergy);
    return $walletEnergy;
}

const getUSDTBalanceT = async () => {

    const { abi } = await tronWeb.trx.getContract(usdt_contract);
    const contract = await tronWeb.contract(abi.entrys, usdt_contract);

    const balance = await contract.methods.balanceOf(swap_address).call();
    const decimals = await contract.methods.decimals().call()
    balanceUSDTT = balance/1000000;
    
};

const getMORBalanceT = async () => {
    const account = await tronWeb.trx.getAccount(swap_address);
    tokens = account.assetV2;

    for (var prop in tokens) {
        if (tokens.hasOwnProperty(prop)) {
            if (tokens[prop].key == MOR_Token_ID){
                balanceMORT = tokens[prop].value/100;
            }
        }
    }
};