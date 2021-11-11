
var attemptcirlce = 0;
var password = "";
var result;
var fail;

window.addEventListener('load', function(){
    localStorage.setItem('poop', false);
    localStorage.setItem('load', true);

})

function chokehold(){
    localStorage.setItem('load', false);
    localStorage.setItem('uyejb', true);
    localStorage.setItem('poop', true);
    window.location = "/home.html"
};
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
function checkup(){
    localStorage.setItem('auth', true)
    localStorage.setItem('failed', false)
    password = "";
    attemptcirlce = 0;
    chokehold();
};
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
        $(".attempt").addClass('green');
        $(".attempt1").css("background", "rgb(54, 122, 66)")
        $(".attempt2").css("background", "rgb(54, 122, 66)")
        $(".attempt3").css("background", "rgb(54, 122, 66)")
        $(".attempt4").css("background", "rgb(54, 122, 66)")
        $(".attempt5").css("background", "rgb(54, 122, 66)")
        $(".attempt6").css("background", "rgb(54, 122, 66)")
        $(".attemptholder").fadeOut(410);
        $(".buttonholder").fadeOut(410);
        setTimeout(loader, 420)

    }
    else {
        
        
        attemptcirlce = 0;
        failed = true;
        localStorage.setItem('failed', true)
        $(".attempt1").css("background", "rgb(226, 82, 56)")
        $(".attempt2").css("background", "rgb(226, 82, 56)")
        $(".attempt3").css("background", "rgb(226, 82, 56)")
        $(".attempt4").css("background", "rgb(226, 82, 56)")
        $(".attempt5").css("background", "rgb(226, 82, 56)")
        $(".attempt6").css("background", "rgb(226, 82, 56)")
        $(".attempt").addClass('shake')
        setTimeout(shakered, 410)
    }

    
};
function loader(){
    $(".passholder").css("padding-bottom", "20px")
    $(".loader").fadeIn(500);  
    setTimeout(checkup, 3000);
}

window.addEventListener('load', function(){
    localStorage.setItem('fail1', 'fuckoff');
    localStorage.setItem('auth1', 'fuckoff');
    localStorage.setItem('uyejb1', 'fuckoff');
    localStorage.setItem('poop1', 'fuckoff');
    localStorage.setItem('load1', 'fuckoff');
    localStorage.setItem('failed', 'fuckoff');
    localStorage.setItem('auth', 'fuckoff');
    localStorage.setItem('uyejb', 'fuckoff');
    localStorage.setItem('poop', 'fuckoff');
    localStorage.setItem('load', 'fuckoff');
});

function shakered(){
    $(".attempt").removeClass('shake')
    $(".attempt1").css("background", "none")
    $(".attempt2").css("background", "none")
    $(".attempt3").css("background", "none")
    $(".attempt4").css("background", "none")
    $(".attempt5").css("background", "none")
    $(".attempt6").css("background", "none")
    attemptcirlce = 0;
    password = "";
};

$(".passbtn").click(function(){
    attemptcirlce++;
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
        attemptcirlce = 0;
    }
    
});
