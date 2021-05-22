//selectors
let getEat = document.querySelector('.bevern-eat-a');
let getDrink = document.querySelector('.bevern-drink-a');
let getVisit = document.querySelector('.bevern-visit-a');

function mouseLeave(e){
    document.querySelector("body").classList.remove("body-backgroundImage-eat", "body-backgroundImage-drink", "body-backgroundImage-visit")
    document.querySelector("body").classList.add("body-backgroundImage-default")
};

//eat eventListeners
getEat.addEventListener("mouseover",function(e){
    document.querySelector("body").classList.add("body-backgroundImage-eat")
});

getEat.addEventListener("mouseleave",mouseLeave);

//drink  eventListeners
getDrink.addEventListener("mouseover",function(e){
    document.querySelector("body").classList.add("body-backgroundImage-drink")
});

getDrink.addEventListener("mouseleave",mouseLeave);

//visit eventListeners
getVisit.addEventListener("mouseover",function(e){
    document.querySelector("body").classList.add("body-backgroundImage-visit")
});

getVisit.addEventListener("mouseleave",mouseLeave);