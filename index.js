
import { clearBoard ,drawOnBoard} from './drawOnBoard.js';

let categories=
[
    {src:"images/animal.jpg",title:"Animals",name:"animal"},
    {src:"images/country.jpg",title:"Countries",name:"country"},
    {src:"images/food.webp",title:"Foods",name:"food"},
    {src:"images/plant.webp",title:"Plants",name:"plant"},
    {src:"images/sport.jpeg",title:"Sports",name:"sport"}

];

let categoriesScreen=document.getElementById("categoriesScreen");
let gameScreen=document.getElementById("gameScreen");
let canvas=document.getElementById("canvas");
let endGameScreen=document.getElementById("endGameScreen");
let endGameText=document.getElementById("endGameText");
let wordReveal=document.getElementById("wordReveal");
let letterBtns=document.querySelectorAll(".letterBtn");
let missingWord=document.getElementById("word");
let categoryTxt=document.getElementById("categoryTxt");
 let hintBtn=document.getElementById("hintIcon");
 let hintText=document.getElementById("hintText");
 let letterHint=document.getElementById("letterHint");
 let muteBtn=document.getElementById("soundIcon");
 let unmuteBtn=document.getElementById("muteIcon");
 let playAgainBtn=document.getElementById("playAgainBtn");
 let menuBtn=document.getElementById("menuBtn");
let selectedCategory;
let lettersArr=[];
let word;
let hint;
let tries=0;
let revealed=false;

//sounds
let letterClick=new Audio("sounds/letterClick.wav");
let buttonClick=new Audio("sounds/buttonClick.mp3");
let categoryClick=new Audio("sounds/categoryClick.mp3");
let correct=new Audio("sounds/correct.mp3");
let wrong=new Audio("sounds/wrongAnswer.mp3");
let won= new Audio("sounds/won.mp3");
let lost=new Audio("sounds/gameLost.mp3");

let arr=[letterClick,buttonClick,categoryClick,correct,wrong,won,lost];



gameScreen.classList.add("hidden");
// create the categories cards to be displayed
categories.forEach(category=>{

    // the div element that holds category image and category text
    let card=document.createElement('div');
    card.classList.add("categoryCard");

    let cardImg=document.createElement('img');
    cardImg.src=category.src;
    cardImg.classList.add("categoryImg");
    cardImg.classList.add(category.name);

    let text=document.createTextNode(category.title);

    card.append(cardImg,text);

    categoriesScreen.appendChild(card);


    cardImg.addEventListener("click",imageClick);
});


let startBtn=document.createElement("button");
startBtn.setAttribute("id","startBtn");
let btnTxt=document.createTextNode("start");
startBtn.appendChild(btnTxt);
categoriesScreen.appendChild(startBtn);

startBtn.addEventListener("click",startGame);
hintBtn.addEventListener("mouseover",hintBtnHoverAnimation);
hintBtn.addEventListener("mouseout",hintBtnMouseOut);
letterHint.addEventListener("mouseover",letterBtnHoverAnimation);
letterHint.addEventListener("mouseout",letterMouseOut);

hintBtn.addEventListener("click",showHint);
letterHint.addEventListener("click",revealLetter);

muteBtn.addEventListener('click',muteAllSounds);
unmuteBtn.addEventListener('click',unmuteAllSounds);


function imageClick(e)
{

    categoryClick.play();
    let images=document.querySelectorAll(".categoryImg");
    images.forEach(image=>{
        image.classList.remove("glowingBorder");

    });

    e.target.classList.add("glowingBorder");
    selectedCategory=e.target.classList[1];

}




// fires when the player clicked the start button
 async function startGame()
{
    letterBtns.forEach(btn=>{
        btn.addEventListener("click",checkExistness);
    })

    pauseAndResetAllSounds();
    buttonClick.play();
    endGameScreen.classList.add("hidden");
    clearGameBoard();
    if(selectedCategory!=null)
    {
        drawOnBoard(canvas,tries);
    categoriesScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    let response=await fetch(`https://www.wordgamedb.com/api/v1/words/?category=${selectedCategory}`);
    let arr=await response.json();
    let rndPos=Math.round(Math.random()*(arr.length-1));
    let chosenWord=arr[rndPos];
     hint=chosenWord.hint;
    word=chosenWord.word;
    let numOfLetters=chosenWord.numLetters;
    categoryTxt.textContent=`Category: ${selectedCategory}`;
    createWord(numOfLetters);
    
    
     }


}



function createWord(numOfLetters)
{
    for(let i=0; i<numOfLetters; i++)
    {
        let letterDiv=document.createElement("div");
        letterDiv.classList.add("letterDiv");
        lettersArr.push(letterDiv);
        missingWord.appendChild(letterDiv);

    }

}





/* this function checks if the letter exists in the word*/
function checkExistness(e)
{
    
    letterClick.play();
    // e is the letter btn that fired the event
    let btn=e.target;
    /* each letter btn has it's corresponding letter value
    e.g: the a btn's value is a too*/
    let val=btn.value;

    btn.removeEventListener('click',checkExistness);


    /* if the letter exists in the word do...*/
    if(count(lettersArr,val,word)>0)
     {
        /*now we want to display the guessed letter*/
        let pos=0;
        /* the while loop will run as long as we find the letter in the word*/
        while(word.indexOf(val,pos)!=-1)
        {
            /* index is the index of the letter in 
            the word starting from pos (inclusive). 
            in the first iteration pos equals zero*/
            let index=word.indexOf(val,pos);
            // create a text node that contains the letter
            let txt=document.createTextNode(val.toUpperCase());
            // append the text node to the divs array in the corresponding position
            if(!lettersArr[index].hasChildNodes())
            {
            lettersArr[index].appendChild(txt);
            }
            /* update the position so that it 
            starts from the current index of the letter plus 1*/
            pos=word.indexOf(val,pos)+1;

        }

        

        btn.classList.add("correctClickedLetter");

      if(checkGuessedWord())
      {
        endGame(true);
      }

      else
      {
        pauseAndResetAllSounds();
        correct.play();

      }

        

     }


     // if the guessed letter doesn't occur in the word
     else{
        // add to failed tries
        tries++;
        
        // use the imported function to get the current state image
       // wrong.play();
        drawOnBoard(canvas,tries);
        btn.classList.add("wrongClickedLetter");
        

        if(tries==6)
        {
            endGame(false);
        }

        else
        {
            pauseAndResetAllSounds();
            wrong.play();
        }
        
     }

}


// hint btn hover animation
function hintBtnHoverAnimation()
{
    hintBtn.classList.add("fa-shake");

}


// when player stops hovering with the mouse, remove the shake animation
function hintBtnMouseOut()
{
    hintBtn.classList.remove("fa-shake");
}


// letter hint btn hover animation
function letterBtnHoverAnimation()
{
    letterHint.classList.add("fa-bounce");

}

function letterMouseOut()
{
    letterHint.classList.remove("fa-bounce");
}

function showHint()
{
    hintText.textContent=`Hint:${hint}`;
    hintBtnMouseOut();
    hintBtn.removeEventListener('click',showHint);
    hintBtn.removeEventListener('mouseover',hintBtnHoverAnimation);
    hintBtn.removeEventListener('mouseout',hintBtnMouseOut);
    hintBtn.classList.add("usedHint");

}


function revealLetter()
{
    let index=Math.round(Math.random()*(word.length-1));

    while(lettersArr[index].hasChildNodes())
        {
            index=Math.round(Math.random()*(word.length-1));
        }

        let txt=document.createTextNode(word[index].toUpperCase());
        lettersArr[index].appendChild(txt);

        letterMouseOut();
    letterHint.removeEventListener('click',revealLetter);
    letterHint.removeEventListener('mouseover',letterBtnHoverAnimation);
    letterHint.removeEventListener('mouseout',letterMouseOut);
    letterHint.classList.add("usedHint");

    if(checkGuessedWord())
    {
        endGame(true);
    }

    

}



function endGame(win)
{
    pauseAndResetAllSounds();
    gameScreen.classList.add("transparent");

    if(win)
    {
        won.play();
        endGameText.textContent="You guessed the word!\n  Well Done";
        wordReveal.textContent="";
    
    }

    else
    {
        lost.play();
        endGameText.textContent="Ouch!\n Better luck next time:)";
        wordReveal.textContent=`The word was ${word}`;
    }

    endGameScreen.classList.remove("hidden");
    playAgainBtn.addEventListener("click",startGame);
    menuBtn.addEventListener("click",displayMenu);

    letterBtns.forEach(btn=>
    {
        btn.removeEventListener("click",checkExistness);

    })



}


function displayMenu()
{
    pauseAndResetAllSounds();
    buttonClick.play();
    gameScreen.classList.add("hidden");
    categoriesScreen.classList.remove("hidden");
    endGameScreen.classList.add("hidden");
    clearGameBoard();
}


function clearWord()
{
    lettersArr.forEach(letter=>{
        letter.remove();
    })

    lettersArr=[];
}

function restoreHintBtns()
{
    hintBtn.classList.remove("usedHint");
    letterHint.classList.remove("usedHint");

    hintBtn.addEventListener("click",showHint);
    letterHint.addEventListener("click",revealLetter);

    hintBtn.addEventListener("mouseover",hintBtnHoverAnimation);
    hintBtn.addEventListener("mouseout",hintBtnMouseOut);

    letterHint.addEventListener("mouseover",letterBtnHoverAnimation);
    letterHint.addEventListener("mouseout",letterMouseOut);
}


function clearHint()
{
    hintText.textContent="";
}


function restoreKeyBoard()
{
    letterBtns.forEach(btn=>{
        btn.classList.remove("correctClickedLetter");
        btn.classList.remove("wrongClickedLetter");
    })
}


function clearGameBoard()
{
    tries=0;
    clearWord();
    clearBoard(canvas);
    restoreHintBtns();
    clearHint();
    restoreKeyBoard();
    letterBtns.forEach(btn=>
    {
        btn.addEventListener("click",checkExistness);

    })
    gameScreen.classList.remove("transparent");

}


function checkGuessedWord()
{
    let guessed=true;

    lettersArr.forEach(letter=>
    {
        if(!letter.hasChildNodes()) guessed=false;

    })

    return guessed;
}


function pauseAndResetAllSounds()
{
    arr.forEach(sound=>
    {
        sound.pause();
        sound.currentTime=0;

    });
    
    

}


function muteAllSounds()
{
    arr.forEach(sound=>
    {
        sound.muted=true;

    });

    muteBtn.classList.add('hidden');
    unmuteBtn.classList.remove('hidden');
}

function unmuteAllSounds()
{
    arr.forEach(sound=>{
        sound.muted=false;

    });

    unmuteBtn.classList.add('hidden');
    muteBtn.classList.remove('hidden');
}


function count(arr,ch,str)
{
    let count=0;
    arr.forEach((element,index)=>{
        if(str[index]==ch)
        {
            if(!element.hasChildNodes()) count++;

        }
        

    });

    return count;

}





