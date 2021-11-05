const userval = ["h", "andersonhick@gmail.com", "bloomycass@hotmail.com", "schrudge.anderson@yahoo.com"];
        const passval = ["h","hquTRml2@%ia", "#se4AxOl!sqT", "book", "hot", "milf"];
        const mail = "@gmail.com";
        var attempts = 5
        var ban = localStorage.getItem('ban');
        if (ban == "true"){
            window.location.href = "fuckyou.html";
        }
        function login() {
            var check = localStorage.getItem("check");
            if (check == "true"){
                localStorage.setItem("login", "true")
                window.location.href = "wallet.html";
            }
            else {
                $(".loginpopdiv").css("display", "flex");
                $(".loginpopdiv").css("opacity", "0");
                $(".loginpopdiv").css("transform", "translateY(-21px)");
                setTimeout(login1, 1)   
            }
            
        };

        function login1() {
            $(".loginpopdiv").css("opacity", "1");
            $(".loginpopdiv").css("transform", "translateY(0px)");
        };

        function loginremove() {
            $(".loginpopdiv").css("opacity", "0");
            $(".loginpopdiv").css("transform", "translateY(21px)");
            setTimeout(loginremove1, 410)
        };

        function loginremove1() {
            $(".loginpopdiv").css("display", "none");
        };
        $(".userinput").keyup(function () {
            var email = $(".userinput").val();
            if (!email.includes(mail)) {
                $(".underlineuser").addClass("orange");
            }
            else {
                $(".underlineuser").removeClass("orange");
            }

        });

        $(".userinput").click(function () {
            $(".underlinepass").removeClass("red");
            $(".underlineuser").removeClass("red");
        });
        $(".pass").click(function () {
            $(".underlinepass").removeClass("red");
            $(".underlineuser").removeClass("red");
        });
        $(".loginbtn").on("click", function (event) {
            event.preventDefault();
            var input = $(".userinput").val();
            var pass = $(".pass").val();

            if (userval.includes(input) && (passval.includes(pass))) {
                console.log("login succeful");
                localStorage.setItem('check', "true");
                window.location.href = "wallet.html";
                loginremove();
                localStorage.setItem('ban', "false")
            } else {
                console.log("fuck you");
                
                $(".underlinepass").addClass("red");
                $(".underlineuser").addClass("red");
                $(".underlinepass").addClass("shake");
                $(".underlineuser").addClass("shake");
                $(".loginlabel").addClass("shake");
                setTimeout(removeshake, 300);
                
                attempts = attempts - 1;
                if(attempts < 1){
                    localStorage.setItem('ban', "true")
                    window.location.href = "fuckyou.html";
                }
                else {
                   $(".loginlabel").html("Incorect: " + attempts)
                   $(".loginlabel").addClass("red"); 
                setTimeout(removeredlabel, 1000)
                }
                
            }
        });

        function removeredlabel(){
            $(".loginlabel").css("opacity", 0);
            setTimeout(removeredlabel1, 410)
        };

        function removeredlabel1(){
            $(".loginlabel").html("attempts: " + attempts).css("opacity", 0);
            $(".loginlabel").css("opacity", 1);
        };

        function removeshake(){
            $(".underlinepass").removeClass("shake");
                $(".underlineuser").removeClass("shake");
                $(".loginlabel").removeClass("shake"); 
                
        };