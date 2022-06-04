var sushi = 0; // Current amount of Sushi.
var money = 0; // Current amount of Money.
var sushi_Add_Player = 1; // Amount of Sushi the player receives with each click.
var sushi_Add_Passive = 0; // Amount of Sushi the player receives from all the passive upgrades. 
var sushi_Price = 1; // Amount of money the player receives for selling Sushi.
var autoSell = false; // Toggle for AutoSell.
var autoSellinterval; // The interval that repeats Autoselling, referenced so it can be turned off.
var amountPerSecond = 0; // Current amount of Sushi per second generated.
var maxAmountPerSecond = 0; // Max amounot of Sushi per second generated.

// All upgrades and their data
var upgrades =
{
    'Upgrade1':
    {
        'Name': 'Worker',
        'SushiAmount': '1',
        'UpgradeCost': '1',
        'UpgradeMultiplier': '2'
    },

    'Upgrade2':
    {
        'Name': 'Chef',
        'SushiAmount': '5',
        'UpgradeCost': '50',
        'UpgradeMultiplier': '1.2'
    },

    'Upgrade3':
    {
        'Name': 'Restaurant',
        'SushiAmount': '50',
        'UpgradeCost': '100',
        'UpgradeMultiplier': '1.2'
    },

    'Upgrade4':
    {
        'Name': 'Factory',
        'SushiAmount': '200',
        'UpgradeCost': '1000',
        'UpgradeMultiplier': '1.2'
    },

    'Upgrade5':
    {
        'Name': 'Manual',
        'SushiAmount': '1',
        'UpgradeCost': '1',
        'UpgradeMultiplier': '1.2'
    },
    
    'Upgrade6':
    {
        'Name': 'Sushi',
        'SushiAmount': '1',
        'UpgradeCost': '5',
        'UpgradeMultiplier': '2'
    }
    
}

//Main function that is executed as soon as the document loads
function Main() {
    let interval = setInterval(() => {
        AddSushi('Passive', sushi_Add_Passive);
    }, 1000);

}

//Adds Sushi. 'type' has to be either 'Player' or 'Passive'.
function AddSushi(type) {
    switch (type) {
        case 'Player':
            sushi += sushi_Add_Player;
            amountPerSecond += sushi_Add_Player;
            if (amountPerSecond > maxAmountPerSecond)
            {
                maxAmountPerSecond = amountPerSecond;
            }
            UpdateHTML();
            break;

        case 'Passive':
            sushi += sushi_Add_Passive;
            amountPerSecond = 0;
            break;
    }
    UpdateHTML();
}

//Sells Sushi. Takes one parameter, 'amount'.
function SellSushi(amount)
{
    if (sushi >= amount)
    {
        money += (amount * sushi_Price);
        sushi -= amount;
    }
    UpdateHTML();
}


//Runs everytime the player buys any upgrade. This function takes one parameter - 'upgrade'. It searches for said upgrade in the 'upgrades' object, and updates the passive Sushi generated, as well as updating the upgrade cost for the next one - it uses the 'UpgradeMultiplier' to calculate the cost for the next one.
function Add_Passive(upgrade) {

    if (money >= upgrades[upgrade].UpgradeCost)
    {
        money -= upgrades[upgrade].UpgradeCost;
        sushi_Add_Passive += Number(upgrades[upgrade].SushiAmount);
        if (sushi_Add_Passive > maxAmountPerSecond)
        {
            maxAmountPerSecond = sushi_Add_Passive;
        }
        upgrades[upgrade].UpgradeCost *= upgrades[upgrade].UpgradeMultiplier;
        let buttonId = 'UpgradeBtn_' + upgrade;
        document.querySelector(`#${buttonId}`).textContent = "Buy (Cost: $" + `${Math.ceil(upgrades[upgrade].UpgradeCost)}`;
        console.log(upgrades[upgrade].UpgradeCost);
    }

    UpdateHTML();
}

//This function is used to upgrade the player's click - Including its next upgrade.
function Add_Manual()
{
    if (money >= upgrades.Upgrade5.UpgradeCost)
    {
        money -= upgrades.Upgrade5.UpgradeCost;
        sushi_Add_Player += Number(upgrades.Upgrade5.SushiAmount);
        upgrades.Upgrade5.UpgradeCost *= upgrades.Upgrade5.UpgradeMultiplier;
        document.querySelector("#PlayArea_Btn-PlayerUpgrade").textContent = "Upgrade Click (Cost: $" + Math.ceil(upgrades.Upgrade5.UpgradeCost) + ")";
    }
    UpdateHTML();
}

//This function is used to upgrade the selling price of the Sushi - Including its next upgrade.
function Sell_Upgrade()
{
    if (money >= upgrades.Upgrade6.UpgradeCost)
    {
        money -= upgrades.Upgrade6.UpgradeCost;
        sushi_Price += Number(upgrades.Upgrade5.SushiAmount);
        upgrades.Upgrade6.UpgradeCost *= upgrades.Upgrade6.UpgradeMultiplier;
        document.querySelector("#PlayArea_Btn-SushiUpgrade").textContent = "Upgrade Sushi Selling Cost (Cost: $" + Math.ceil(upgrades.Upgrade6.UpgradeCost) + ")";
    }
    UpdateHTML();
}

//Autosell function
function AutoSell()
{
    money += sushi;
    sushi = 0;
    UpdateHTML();
}


//Autosell Toggle
function AutoSellToggle()
{
    if(autoSell == true)
    {
        autoSell = false;
        clearInterval(autoSellinterval);
    }
    else
    {
        autoSell = true;
        autoSellinterval = setInterval(() => {
            AutoSell();
            }, 1);
    }
}

//Function that updates all the HTML
function UpdateHTML() {
    document.querySelector("#SushiAmount").textContent = sushi;
    document.querySelector("#MoneyAmount").textContent = Math.floor(money);
    document.querySelector("#SPS").textContent = "Sushi Per Second: " + Number(sushi_Add_Passive + amountPerSecond) + " (Current) / " + maxAmountPerSecond + (" (Max)");
}


//Runs Main() when the global object "window" is loaded. Basically the "root" JavaScript object.
window.onload = Main();