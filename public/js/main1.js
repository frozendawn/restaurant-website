let getEat = document.querySelector('.bevern-eat-a');

//photo-1550547660-d9450f859349.jpg
//background-image: url("./img/food-712665_1920.jpg");
function changeBackground(e) {
    document.querySelector("body").style.backgroundImage = "url(./img/blur-breakfast-chef-cooking-262978.jpg)";
    document.querySelector("body").style.backgroundPosition = "center";
    document.querySelector("body").style.backgroundRepeat = "no-repeat";
    document.querySelector("body").style.size = "cover";
/*     background-position: center;
    background-repeat: no-repeat;
    background-size: cover; */
}

function changeBackground1(e) {
    document.querySelector("body").style.backgroundImage = "url(./img/food-712665_1920.jpg)";
}

getEat.addEventListener("mouseover",changeBackground);
getEat.addEventListener("mouseout",changeBackground1);