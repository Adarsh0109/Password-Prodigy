const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[datalength]");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#numbers");
const symbolcheck=document.querySelector("#symbols");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const indicator = document.querySelector(".data-indicator");
const copyBtn = document.querySelector("[data-copy]");
const generateBtn = document.querySelector(".generate-button");

let passwordLength=10;
let password="";
let checkCount = 0;

handleSlider();

//set strength color to grey
setIndicator("#ccc");


// function to handle the values of slider
function handleSlider()
{
    inputSlider.value=passwordLength; //to set slider equal to 10
    lengthDisplay.innerText=passwordLength; // to set initial value of password to 10;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow - HW
}


//function that will generate the random integer between the range i.e max and min;

function getRandomInteger(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNumber()
{
    return getRandomInteger(0,9);
}


function getRandomLowercase()
{
    let ascii_code=getRandomInteger(97,123);
   return String.fromCharCode(ascii_code);
}
function getRandomUppercase()
{
    let ascii_code=getRandomInteger(65,91);
   return String.fromCharCode(ascii_code);
}
function getRandomSymbol()
{
    let ascii_code=getRandomInteger(33,64);
      return String.fromCharCode(ascii_code);

}
// console.log("working something61 ");
function calcStrength()
{
    let hasNum=false;
    let hasUpper=false;
    let hasLower=false;
    let hasSym=false;
    if(uppercasecheck.checked)
    hasUpper=true;
    if(lowercasecheck.checked)
    hasLower=true;
    if(numbercheck.checked)
    hasNum=true;
    if(symbolcheck.checked)
    hasSym=true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }

   
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}
// console.log("working something106 ");

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}




inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})
// console.log("working something145 ");

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
   
    if(checkCount == 0) 
        return;
       
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    
    let funcArr = [];

    if(uppercasecheck.checked)
        funcArr.push(getRandomUppercase);

    if(lowercasecheck.checked)
        funcArr.push(getRandomLowercase);

    if(numbercheck.checked)
        funcArr.push(getRandomNumber);

    if(symbolcheck.checked)
        funcArr.push(getRandomSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandomInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});