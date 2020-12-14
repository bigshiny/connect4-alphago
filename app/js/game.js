const maxRow = 6;  // the max Row of connect4
const maxCol = 7;  // the max Columns of connect4
// game boards
let boards = new Array(maxRow);
for(let i = 0; i < maxRow; i++) {
  boards[i] = new Array(maxCol).fill(0);
};
// history of the game
let history = {
    player1: [],
    player2: []
};
let moves = 0;  // How many moves
let $player1 = document.getElementsByClassName("player1");
let player1Length = $player1.length;
let $player2 = document.getElementsByClassName("player2");
let player2Length = $player2.length;

const topPercents = [
    "14.2857%",  // top 0
    "28.5714%",  // top 1
    "42.8571%",  // top 2
    "57.1429%",  // top 3
    "71.4286%",  // top 4
    "85.7143%"  // top 5
]

const leftPercents = [
    "0%",  // left 0
    "14.2857%",  // left 1
    "28.5714%",  // left 2
    "42.8571%",  // left 3
    "57.1429%",  // left 4
    "71.4286%",  // left 5
    "85.7143%"  // left 6
]

// ↓ボタンを押すとピースを落とす関数
function dropPiece(col){
    let playerStyle = getCurrentPlayer();
    if (playerStyle === $player1) {
        userMove(playerStyle, col);
    }else{
        userMove(playerStyle, col);
    }
}

function userMove(playerStyle, col){
    // the move of user
    playerStyle.style = "";
    playerStyle.style.left = leftPercents[col];

    let num = getNumPieces(col);
    let max = maxRow - 1 - num;

    // 上からmaxの位置までピースを動かす
    let i = 0;
    let movePiece = function(){
        playerStyle.style.top = topPercents[i];
        i += 1;
        let job = setTimeout(movePiece, 80);
        if (i > max){
            clearTimeout(job);
        }
    }
    movePiece();

    // boards(試合状況)を更新
    if (playerStyle.className === "player1"){
        boards[maxRow-1-num][col] = 1;
        history.player1.push([maxRow-1-num, col]);  // history(試合履歴)を更新
    }else{
        boards[maxRow-1-num][col] = 2;
        history.player2.push([maxRow-1-num, col]);  // history(試合履歴)を更新
    }

    // 勝利確認
    let winnerFlg = checkWinner();

    // 次プレイヤーへ切替
    if (winnerFlg === 0) {
        removeClass()
        if (playerStyle.className === "player1"){
            document.getElementById("player1").className = "player you inactive";
            document.getElementById("player2").className = "player ai active";
        }else{
            document.getElementById("player1").className = "player you active";
            document.getElementById("player2").className = "player ai inactive";
        }
    }

    moves++;
    return;
}

function aiMove(){
    // the move of AI
    // input: boards (Current game status)
    // ex. [[0, 1, 0, 0, 0, 2, 0],
    //      [0, 2, 1, 0, 1, 2, 1],
    //      ...](6 × 7)
    // 1: piece of player1 / 2: piece of player2 / 0: none piece
    // process:
    // calculate the position (col) where the piece should be inserted to win,
    // put on javascript:dropPiece(col)
    return;
}

// How many existing pieces are there in the col?
function getNumPieces(col){
    let npieces = 0;
    for (let i = 0; i < maxRow; i++){
        if (boards[i][col] !== 0){
            npieces++;
        }
    }
    return npieces;
}

// change Player
function changePlayer(moves){
    if ((moves % 2) === 0) {
        // if i is even number, player is set to "player1"
        return $player1;
    }else{
        // if i is old number, player is set to "player2"
        return $player2;
    }
}

// 現在のプレイヤー取得
function getCurrentPlayer (){
    let $player = changePlayer(moves);
    let playerMoves = Math.floor(moves/2);  // 各プレイヤーがピースを落とした回数
    let cPlayerStyle = $player[playerMoves];
    return cPlayerStyle
}

// プレイヤーのクラスを消去
function removeClass(){
    document.getElementById("player1").className = "";
    document.getElementById("player2").className = "";
}

// 勝者チェック
function checkWinner(){
    // ~Flg = [winner flg, standard row, standard column]
    horizontalFlg = horizontalCheck();
    verticalFlg = verticalCheck();
    diagonalFlg = diagonalCheck();
    if (horizontalFlg[0] !== 0){
        popupImage(horizontalFlg[0]);
        let row = horizontalFlg[1];
        let col = horizontalFlg[2];
        function flashPieces(){
            for (i = 0; i < moves; i++){
                let player = $("div[class='player"+horizontalFlg[0]+"']")[i]
                if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row])){
                    player.outerHTML='<div id="flash" class="player'+horizontalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }else if ((player.style.left === leftPercents[col+1]) && (player.style.top === topPercents[row])){
                    player.outerHTML='<div id="flash" class="player'+horizontalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }else if ((player.style.left === leftPercents[col+2]) && (player.style.top === topPercents[row])){
                    player.outerHTML='<div id="flash" class="player'+horizontalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }else if ((player.style.left === leftPercents[col+3]) && (player.style.top === topPercents[row])){
                    player.outerHTML='<div id="flash" class="player'+horizontalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }
            }
        }
        setTimeout(flashPieces, 500);
        return horizontalFlg;
    }else if (verticalFlg[0] !== 0){
        popupImage(verticalFlg[0]);
        let row = verticalFlg[1];
        let col = verticalFlg[2];
        function flashPieces(){
            for (i = 0; i < moves; i++){
                let player = $("div[class='player"+verticalFlg[0]+"']")[i]
                if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row])){
                    player.outerHTML='<div id="flash" class="player'+verticalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }else if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row+1])){
                    player.outerHTML='<div id="flash" class="player'+verticalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }else if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row+2])){
                    player.outerHTML='<div id="flash" class="player'+verticalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }else if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row+3])){
                    player.outerHTML='<div id="flash" class="player'+verticalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                }
            }
        }
        setTimeout(flashPieces, 500);
        return verticalFlg;
    }else if (diagonalFlg[0] !== 0){
        popupImage(diagonalFlg[0]);
        let row = diagonalFlg[1];
        let col = diagonalFlg[2];
        function flashPieces(){
            for (i = 0; i < moves; i++){
                let player = $("div[class='player"+diagonalFlg[0]+"']")[i]
                if (row > 2){  // check positively sloped diagonals
                    if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }else if ((player.style.left === leftPercents[col + 1]) && (player.style.top === topPercents[row - 1])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }else if ((player.style.left === leftPercents[col + 2]) && (player.style.top === topPercents[row - 2])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }else if ((player.style.left === leftPercents[col + 3]) && (player.style.top === topPercents[row - 3])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }
                }else{  // negatively sloped diagonals
                    if ((player.style.left === leftPercents[col]) && (player.style.top === topPercents[row])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }else if ((player.style.left === leftPercents[col + 1]) && (player.style.top === topPercents[row + 1])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }else if ((player.style.left === leftPercents[col + 2]) && (player.style.top === topPercents[row + 2])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }else if ((player.style.left === leftPercents[col + 3]) && (player.style.top === topPercents[row + 3])){
                        player.outerHTML='<div id="flash" class="player'+diagonalFlg[0]+'" style="left: '+player.style.left+'; top: '+player.style.top+';"></div>';
                    }
                }
            }
        }
        setTimeout(flashPieces, 500);
        return diagonalFlg;
    }else{
        return 0;
    }
}

// 4つのマスがどちらの色で一致するかどうかをチェック
function checkColorMatch(first, second, third, four){
    return (first === second && first === third && first === four && first !== 0);
}

// 水平方向にチェックして勝利プレイヤーフラグを返す
function horizontalCheck(){
    for (let row = 0; row < maxRow; row++){
        for (let col = 0; col < maxCol - 3; col++){
            if (checkColorMatch(
                boards[row][col],
                boards[row][col+1],
                boards[row][col+2],
                boards[row][col+3],
            )){
                return [boards[row][col], row, col];
            }
        }
    }
    return [0, "", ""];
}

// 鉛直方向にチェックして勝利プレイヤーフラグを返す
function verticalCheck(){
    for (let col = 0; col < maxCol; col++){
        for (let row = 0; row < maxRow - 3; row++){
            if (checkColorMatch(
                boards[row][col],
                boards[row+1][col],
                boards[row+2][col],
                boards[row+3][col],
            )){
                return [boards[row][col], row, col];
            }
        }
    }
    return [0, "", ""];
}

// 斜め方向にチェックして勝利プレイヤーフラグを返す
function diagonalCheck(){
    // check positively sloped diagonals
    for (let col = 0; col < maxCol - 3; col++){
        for (let row = maxRow - 3; row < maxRow; row++){
            if (checkColorMatch(
                boards[row][col],
                boards[row - 1][col + 1],
                boards[row - 2][col + 2],
                boards[row - 3][col + 3],
            )){
                return [boards[row][col], row, col];
            }
        }
    }

    // check negatively sloped diagonals
    for (let col = 0; col < maxCol - 3; col++){
        for (let row = 0; row < maxRow - 3; row++){
            if (checkColorMatch(
                boards[row][col],
                boards[row + 1][col + 1],
                boards[row + 2][col + 2],
                boards[row + 3][col + 3],
            )){
                return [boards[row][col], row, col];
            }
        }
    }
    return [0, "", ""];
}

// reset the game
function reset(){
    location.reload(true);
}

// back the game
function back(){
    moves--;
    let lastPlayer = getCurrentPlayer();
    lastPlayer.style = "";
    lastPlayer.style.display = "none";

    // 表示を「前プレイヤー」へ切替
    removeClass()
    if (lastPlayer.className === "player1"){
        document.getElementById("player1").className = "player you active";
        document.getElementById("player2").className = "player ai inactive";
        lastMove = history.player1.slice(-1)[0];  // 最後のmoveを取り出す
        history.player1.pop();  // 最後のmoveを削除
    }else{
        document.getElementById("player1").className = "player you inactive";
        document.getElementById("player2").className = "player ai active";
        lastMove = history.player2.slice(-1)[0];  // 最後のmoveを取り出す
        history.player2.pop();  // 最後のmoveを削除
    }

    // back the boards
    boards[lastMove[0]][lastMove[1]] = 0;
}

// if the match is finished, popup image is showed.
function popupImage(winnerFlg) {
    var popup = document.getElementById('js-popup');
    if(!popup) return;
    $("#winner-popup").text("player"+winnerFlg+" wins!!");
    popup.classList.add('is-show');

    let blackBg = document.getElementById('js-black-bg');
    let closeBtn = document.getElementById('js-close-btn');
    let showBtn = document.getElementById('js-show-popup');

    closePopUp(blackBg);
    closePopUp(closeBtn);
    closePopUp(showBtn);
    function closePopUp(elem) {
        if(!elem) return;
        elem.addEventListener('click', function() {
            popup.classList.toggle('is-show');
        });
    }
}

setInterval(function() {
    $('[id=flash]').fadeOut(500).fadeIn(500);
}, 1000);