var code;
var card = [];
var token;

$(document).ready(function(){
    $("#getCardButton").click(function(){ //when get card button is clicked after game code input
        resetGreyCells();
        code = $("#gameCodeInp").val();
        $.get("http://www.hyeumine.com/getcard.php?bcode="+code, function(data, status){
            if(status != 'success'){
                alert("Get Card Button Error (Game Code Inp)\nData: " + data + "\nStatus: " + status);
            }
            else{
                if(data == 0){
                    alert("Game code not found!");
                }
                else{
                    $("#startArea").css("display", "none");
                    $("#ttlGameCode").html("Game Code: "+code);
                    $.get("http://www.hyeumine.com/getcard.php?bcode="+code, function(data, status){
                        if(status != 'success'){
                            alert("Getting New Card Error\nData: " + data + "\nStatus: " + status);
                        }
                        else{
                            generateCard();
                        }
                    })
                }
            }
          });
    })

    $("#createNewGame").on('click', function(){ //generate new bingo game
        window.open("http://www.hyeumine.com/newbingogame.php");
    })

    $("#changeCodeLink").on('click', function(){ //from card to start area
        $("#startArea").css({
            "display": "flex",
            "justify-content": "center",
            "flex-direction": "column",
            "align-items": "center",
        });
        $("#cardArea").css("display", "none"); 
    })

    $("#dashboardLink").on('click', function(){ //takes you into the current game's dashboard with rolled numbers
        window.open("http://www.hyeumine.com/bingodashboard.php?bcode="+code, "_blank");
    })

    $(".number td").on('click', function(){ //bingo card cells into grey when clicked for interactivity only, does not affect winning condition
        $(this).toggleClass("grey");
    })

    $("#checkCardBut").on('click', function(){ //Check if card is winning card, dependent on Sir's website
        $.get("http://www.hyeumine.com/checkwin.php?playcard_token="+token, function(data, status){
            if(status != 'success'){
                alert("Check Card Error\nData: " + data + "\nStatus: " + status);
            }
            else{
                if(data == 1){
                    alert("THAT'S BINGO! YOU HAVE WON!")
                }
                else if(data == 0){
                    alert("Your card has not yet won.")
                }
                else{
                    alert("THE DATA IS NOT 1 or 0, THERE IS AN ERROR!")
                }
            }
        })
    })

    $("#newCardBut").on('click', function(){ //Generate another new card 
        resetGreyCells();
        generateCard();
    })
    $("#clearGreyCellsBut").on('click', () => {resetGreyCells()}) //when you want to clear grey cells in bingo card
})

//OUTSIDE FUNCTIONS

function resetGreyCells(){
    $(".number td").removeClass("grey");
}
function generateCard(){
    $.get("http://www.hyeumine.com/getcard.php?bcode="+code, function(data, status){
            if(status != 'success'){
                alert("Getting New Card Error\nData: " + data + "\nStatus: " + status);
            }
            else{
                $("#cardArea").css({
                    "display": "flex",
                    "flex-direction": "column", 
                    "justify-content": "center",
                    "align-items": "center"
                });
            
                var cells = document.querySelectorAll(".number td");
                data = JSON.parse(data);  
                card = [
                    data.card.B,
                    data.card.I,
                    data.card.N,
                    data.card.G,
                    data.card.O
                ]
                token = data.playcard_token;
                for(var i=0; i<5; i++){
                    for(var j=0; j<5; j++){
                        cells[(j*5)+i].innerHTML = card[i][j];
                    }
                }
            }
        })
}