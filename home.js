
var attemptcirlce = 1;
var password = "";
var result;
const doubleStruckUpper = {
    1: "a", 2: "f", 0: "g",
    3: "k", 9: "l", 4: "p", 8: "j",
    5: "u", 7: "v", 6: "z", "#": "y",
    "*": "e"
};
const second = {
    a: "36bdn8s795n943598n4dyf", l: "fc486n87izdm89cn4578395n9shgid", u: "g79yn478x24cn5x34875493875",
    f: "4b5x2786324357cn9436n5c345", p: "343", v: "p32c42454c33c5345c4c5",
    z: "J345834y5cm34wcm4niu4h8uijbnji4ulik", g: "iuy478n4nnufjyh87478478", j: "vn472878injhui4r4mhfni4h7heniuh", 
    y: "zt4893c53535crrrr", e: "y34yn334c534c43c5", k: "eihcn8i3c543c54"
};
$(".passbtn1").click(function(){
    password = password + "1"
});
$(".passbtn2").click(function(){
    password = password + "2"
});
$(".passbtn3").click(function(){
    password = password + "3"
});
$(".passbtn4").click(function(){
    password = password + "4"
});
$(".passbtn5").click(function(){
    password = password + "5"
});
$(".passbtn6").click(function(){
    password = password + "6"
});
$(".passbtn7").click(function(){
    password = password + "7"
});
$(".passbtn8").click(function(){
    password = password + "8"
});
$(".passbtn9").click(function(){
    password = password + "9"
});
$(".passbtn0").click(function(){
    password = password + "0"
});
$(".passbtnhash").click(function(){
    password = password + "#"
});
$(".passbtnstar").click(function(){
    password = password + "*"
});


function checkpassord(){
    result = password.replace(/[0-9,#,*]/g, Letter => doubleStruckUpper[Letter]);
    checkpassword1();
}

function checkpassword1(){
    var result78 = [...result].map(letters => {
    const replaced = second[letters];
    return replaced ? replaced : letters;
    }).join('')

    if (result78 == "36bdn8s795n943598n4dyfeihcn8i3c543c54p32c42454c33c5345c4c5fc486n87izdm89cn4578395n9shgid4b5x2786324357cn9436n5c345vn472878injhui4r4mhfni4h7heniuh"){
        window.location = "https://www.google.com"
        attemptcirlce = 0;
        password = "";
        $(".attempt1").css("background", "none")
        $(".attempt2").css("background", "none")
        $(".attempt3").css("background", "none")
        $(".attempt4").css("background", "none")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
    }
    else {
        password = "";
        $(".attempt1").css("background", "none")
        $(".attempt2").css("background", "none")
        $(".attempt3").css("background", "none")
        $(".attempt4").css("background", "none")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
        attemptcirlce = 0;
    }

    
};


$(".passbtn").click(function(){
    
    if (attemptcirlce == 0){
        $(".attempt1").css("background", "none")
        $(".attempt2").css("background", "none")
        $(".attempt3").css("background", "none")
        $(".attempt4").css("background", "none")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
    }
    else if (attemptcirlce == 1){
        $(".attempt1").css("background", "white")
        $(".attempt2").css("background", "none")
        $(".attempt3").css("background", "none")
        $(".attempt4").css("background", "none")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
    }
    else if (attemptcirlce == 2){
        $(".attempt1").css("background", "white")
        $(".attempt2").css("background", "white")
        $(".attempt3").css("background", "none")
        $(".attempt4").css("background", "none")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
    }
    else if (attemptcirlce == 3){
        $(".attempt1").css("background", "white")
        $(".attempt2").css("background", "white")
        $(".attempt3").css("background", "white")
        $(".attempt4").css("background", "none")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
    }
    else if (attemptcirlce == 4){
        $(".attempt1").css("background", "white")
        $(".attempt2").css("background", "white")
        $(".attempt3").css("background", "white")
        $(".attempt4").css("background", "white")
        $(".attempt5").css("background", "none")
        $(".attempt6").css("background", "none")
    }
    else if (attemptcirlce == 5){
        $(".attempt1").css("background", "white")
        $(".attempt2").css("background", "white")
        $(".attempt3").css("background", "white")
        $(".attempt4").css("background", "white")
        $(".attempt5").css("background", "white")
        $(".attempt6").css("background", "none")
    }
    else if (attemptcirlce == 6){
        $(".attempt1").css("background", "white")
        $(".attempt2").css("background", "white")
        $(".attempt3").css("background", "white")
        $(".attempt4").css("background", "white")
        $(".attempt5").css("background", "white")
        $(".attempt6").css("background", "white")
        checkpassord();
    }
    attemptcirlce++;
});
