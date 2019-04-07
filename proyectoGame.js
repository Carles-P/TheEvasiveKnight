const rl = require('readline-sync');
const fs = require('fs');

/**
 * This function takes a number and returns the possible coordinates resulting from combining all numbers from '1' to 'sideLength' in a two-dimension matrix. 
 * @param {number} sideLength The number of columns (and rows) that the matrix will have.
 * @returns {array<array>} The resulting array of possible coordinates (arrays).
 */
function getPossibleCoordinates(sideLength){ //se introduce un número para la longitud de un lado del tablero (número de casillas por lado)
    let side = [];
    for(i=1;i<=sideLength;i++){
        side.push(i); //crea un array de números de 1 al número "sideLength"
    }
    let possibleCoordinates = []
    for(j=1;j<=sideLength;j++){
        for(let item of side){
            possibleCoordinates.push([j,item]) //combina cada número del array con cada uno de los números del mismo array para crear un array de arrays (pares de coordenadas x e y)
        }
    }
    return possibleCoordinates; //devuelve todas las posibles coordenadas del tablero, fuera de éstas no se puede jugar
}

/**
 * This function checks if a pair of coordinates is included in a given array of possible coordinates.
 * @param {array} coordinates A two-element array representing coordinates.
 * @param {arra<array>} possibleCoordinates An array of possible coordinates in a two-dimension matrix (array of arrays).
 * @returns {boolean}
 */
function isIncludedInPossibleCoordinates(coordinates,possibleCoordinates){ //se introducen la coordenada concreta a comparar y las coordenadas posibles
    let included = false;
    if(coordinates)
    for(let item of possibleCoordinates){
        if(coordinates[0]===item[0] && coordinates[1]===item[1]){ //si la coordenada a comparar está incluida en las coordenadas posibles asigna true a "included"
            included = true;
            break;
        }
    }
    return included;
}

/**
 * This function takes an indication of direction and starting point and returns the arrival position.
 * @param {array} position A pair of coordinate to indicate the starting point to move from.
 * @param {number} direction A number to indicate direction according to a code ('8': "up", '2': "down", '4': "left", '6': "right").
 * @returns {array} A three-item array with the resulting arrival position pair of coordinates and the string indicating intentional direction.
 */
function getCoordinatesFromDirection(position,direction){ //se introduce una posición de partida y una intención de dirección indicada con lógica de teclado numérico
    let coordinates = [];
    if(direction===8){
        coordinates = [position[0],position[1]-1,'upwards'];
    }
    else if(direction===2){
        coordinates = [position[0],position[1]+1,'downwards'];
    }
    else if(direction===4){
        coordinates = [position[0]-1,position[1],'left'];
    }
    else if(direction===6){
        coordinates = [position[0]+1,position[1],'right'];
    }
    return coordinates; //devuelve posición de llegada (elementos 0 y 1 del array) y el string del nombre de la dirección (elemento 2 del array)
}

/**
 * This function builds a string representing a row of board squares with a character drawn in one of the squares.
 * @param {string} character A string indicating which character has to be drawn.
 * @param {number} xCoordinate A number indicating horizontal position where the character will be drawn.
 * @param {number} sideLength A number indicating number of squares per row.
 * @returns {string} The resulting string represeting the row of squares with the character drawn in a given horizontal position.
 */
function drawCharacterRow(character,xCoordinate,sideLength){
    let squareCharacterRow = '';
    let squareLine = '*           '; //línea vacía que empieza con un asterisco, esta será la anchura de las casillas, que estarán formadas por 4 'squareLines' dibujadas
                                     //una encima de la otra.
    let monstaPic = ['*    \\|/ /  ','*    `_´/   ','*  \\/(_)    ','*   _/ \\_   ']; //el dibujo de Mr Monsta ocupará cuatro líneas de output, con los cuatro elementos
                                                                                      //del array, dibujados uno encima del otro
    let knightPic = ['*    /+\\    ',"* \\  '-'_   ",'*  \\/|_(+)  ','*   _/ \\_   ']; //ídem para Mr Knight
    for(let i=0;i<4;i++){ //una fila de casillas estará formada por 4 líneas idénticas (excepto para la casilla donde se encuentre el personaje)
        squareCharacterRow += '**'; //cada línea empieza por dos asteriscos para dibujar el borde del tablero
        for(let j=1;j<=sideLength;j++){ //cada número de '1' a 'sideLength' añade un 'squareString' a la línea
		    if(j===xCoordinate){           //cuando el número horizontal de casilla se corresponde con la coordenada x en la que se encuentra el personaje, se dibujará
                if(character==='monsta'){  //el elemento del array monstaPic o knightPic que se encuentre en la posición i
                    squareCharacterRow += monstaPic[i];
                }else if(character==='knight'){
                    squareCharacterRow += knightPic[i];
                }
			    
		    }else{
			    squareCharacterRow += squareLine;
            }
        }
        squareCharacterRow += '***' + '\n' //se añade línea nueva al final de cada línea para que en el output se impriman las líneas una encima de la otra
    }
    return squareCharacterRow;
}

/**
 * This function builds a string representing a row of board squares with both characters drawn in two of the squares.
 * @param {number} monstaXPosition A number indicating horizontal position of Mr Monsta.
 * @param {number} knightXPosition A number indicating horizontal position of Mr Knight.
 * @param {number} sideLength A number indicating number of squares per row.
 * @returns {string} The resulting string represeting the row of squares with the characters drawn in the given horizontal positions.
 */
function drawBothCharRow(monstaXPosition,knightXPosition,sideLength){ //variante de la función anterior con ambos personajes dibujados en la fila de casillas
    let squareCharacterRow = '';
    let squareLine = '*           ';
    let monstaPic = ['*    \\|/ /  ','*    `_´/   ','*  \\/(_)    ','*   _/ \\_   '];
    let knightPic = ['*    /+\\    ',"* \\  '-'_   ",'*  \\/|_(+)  ','*   _/ \\_   '];
    for(let i=0;i<4;i++){
        squareCharacterRow += '**';
        for(let j=1;j<=sideLength;j++){
		    if(j===monstaXPosition || (j===monstaXPosition && j===knightXPosition)){ //cuando ambos personajes están en la misma casilla, Mr Monsta ha ganado y sólo se
                squareCharacterRow += monstaPic[i];                                  //dibuja a éste.
            }else if(j===knightXPosition && j!==monstaXPosition){
                squareCharacterRow += knightPic[i];
		    }else{
			    squareCharacterRow += squareLine;
            }
        }
        squareCharacterRow += '***' + '\n'
    }
    return squareCharacterRow;
}

/**
 * This function creates a string represeting an equally-sized board with two characters drawn in two of the resulting squares.
 * @param {number} sideLength Numer of squares per row and column that the board will have.
 * @param {array} monstaPosition Pair of coordinates indicating Mr Monsta's position.
 * @param {array} knightPosition Pair of coordinates indicating Mr Knight's position.
 * @returns {string} This string represents the board with the characters on it.
 */
function getBoard(sideLength,monstaPosition,knightPosition){ //esta función tiene una lógica similar a las anteriores pero dibujará el tablero entero, así como muchas
                                                             //filas de casillas vacías y llamará a las funciones anteriores para dibujar los personajes
    let row = '************'; //límite superior e inferior de cada casilla
    let squareLine = '*           ';
    let rowOfRows = '';
    let squareRow = '';
    let board = '';
    let monstaRow = '';
    let knightRow = '';
    let monstaKnightRow = ''; //cuando ambos personajes estén en la misma fila de casillas
    for(i=0;i<sideLength;i++){
        if(i===0){
            rowOfRows = '**' + row; //para dibujar el borde izquierdo del tablero
        }else if(i===sideLength-1){
            rowOfRows += row + '***'; //borde derecho del tablero
        }else{
            rowOfRows += row;
        }
    }                                 //esto nos da una línea de asteriscos tan larga como 'sideLength' requiera
    for(i=0;i<=sideLength;i++){
        if(i===0){
            squareRow = '**' + squareLine; //borde izquierdo del tablero para fila de casillas
        }else if(i===sideLength){
            squareRow += '***'; //borde derecho del tablero para fila de casillas
        }else{
            squareRow += squareLine;
        }
    }                                 //esto nos da una línea de anchos de casilla vacía
                                      //ahora podremos intercalar 1 'rowOfRows' con 4 'squareLines' para construir el tablero, teniendo en cuenta que deberemos llamar
                                      //a las funciones de dibujar personajes en las iteraciones adecuadas
    for(let i=0;i<sideLength;i++){
        if(i===0){
            board += rowOfRows + '\n'; //empezamos a dibujar el tablero con una fila de asteriscos extra en la primera iteración para el borde superior del tablero
        }                              //a partir de aquí vamos intercalando todos aquellos strings definidos anteriormente según los parámetros establecidos
        board += rowOfRows + '\n';
        if(i===monstaPosition[1]-1 && i===knightPosition[1]-1){ //comparamos la iteración con la coordenada Y de los personajes para llamar o no a las funciones
            monstaKnightRow = drawBothCharRow(monstaPosition[0],knightPosition[0],sideLength);
            board += monstaKnightRow;
        }else if(i===monstaPosition[1]-1){
            monstaRow = drawCharacterRow('monsta',monstaPosition[0],sideLength)
            board += monstaRow;
        }else if(i===knightPosition[1]-1){
            knightRow = drawCharacterRow('knight',knightPosition[0],sideLength)
            board += knightRow;
        }else{
            for(let j=0;j<4;j++){
                board += squareRow + '\n';
            }
        }
        if(i===sideLength-1){
            board += rowOfRows + '\n' + rowOfRows; //en la última iteración dibujamos dos líneas de asteriscos para el borde inferior del tablero
        }
    }
    board = '\n' + board; //y añadimos línea vacía al principio para hacer el juego un poco más atractivo visualmente
    return board;        
}

/**
 * This function returns the euclidean distance between two positions.
 * @param {array} p Pair of coordinates.
 * @param {array} q Pair of coordinates.
 * @returns {number} Resulting euclidean distance.
 */
function euclideanDistance(p,q){
    return Math.sqrt(Math.pow((q[0]-p[0]),2) + Math.pow((q[1]-p[1]),2));
}

/**
 * This function provides possible moves from a given position, using the matrix width to obtain the available coordinates to move to.
 * @param {array} coordinates A pair of coordinates indicating position to move from.
 * @param {number} sideLength Side length of the matrix to determine available coordinates to move to.
 * @returns {array<array>} The resulting array of possible coordinates to move to.
 */
function getPossibleMoves(coordinates,sideLength){
    let x = coordinates[0]; //coordenada x
    let y = coordinates[1]; //coordenada y
    let binaryChoiceX = [];
    let binaryChoiceY = [];
    binaryChoiceX.push(x+1); //ambas coordenadas pueden, bien aumentar, bien disminuir una posición para acceder a casillas adyacentes
    binaryChoiceX.push(x-1);
    binaryChoiceY.push(y+1);
    binaryChoiceY.push(y-1);
    let moves = [[x,binaryChoiceY[0]],[x,binaryChoiceY[1]],[binaryChoiceX[0],y],[binaryChoiceX[1],y]];
                                    //para que los posibles movimientos sean a casillas adyacentes y no en diagonal; en primer lugar 'x' se queda constante y la 
                                    //coordenada 'y' cambia mediante binaryChoiceY; o lo mismo pero manteniendo la coordenada 'y' constante y cambiando 'x'.
    let possibleMoves = [];
    for(let move of moves){
        if(isIncludedInPossibleCoordinates(move,getPossibleCoordinates(sideLength))){ //usamos funciones previas para obtener las coordenadas posibles a partir del
            possibleMoves.push(move);                                                 //ancho de matriz y para comparar coordenadas adyacentes a
        }
    }
    return possibleMoves;
}

/**
 * This function simulates a dice throw with variable number of sides and returns a the random number obtained.
 * @param {number} sides The number of sides the dice will have.
 * @returns {number} The resulting integer.
 */
function diceThrow(sides){
    return parseInt((Math.random()*(sides-1)+1).toFixed(0));
}

/**
 * This function returns a random move after getting possible moves from a given position.
 * @param {array} monstaPosition A pair of coordinates indicating starting point.
 * @param {number} sideLength The matrix side length from which the available coordinates will be obtained
 * @returns {array} The resulting move represented by a pair of coordinates.
 */
function getMove(monstaPosition,sideLength){
    let moves = getPossibleMoves(monstaPosition,sideLength); //obtenemos los movimientos posibles con la función definida anteriormente
    let randomNumber = diceThrow(moves.length); //mediante el lanzamiento de un dado escogemos una de las opciones al azar.
    let move = moves[randomNumber-1];
    return move;
}

/**
 * This function chooses the best possible move for Mr Monsta to approach Mr Knight.
 * @param {array} knightPosition A pair of coordinates to indicate Mr Knight's position.
 * @param {array} monstaPosition A pair of coordinates to indicate Mr Monsta's position.
 * @param {number} sideLength The side length of the matrix to obtain the possible coordinates.
 * @returns {array} The best possible move represented by a pair of coordinates.
 */
function getSmartMove(knightPosition,monstaPosition,sideLength){
    let currentDistance = euclideanDistance(monstaPosition,knightPosition); //medimos la distancia euclidea actual
    let moves = getPossibleMoves(monstaPosition,sideLength); //obtenemos los movimientos posibles de Mr Monsta
    let enemyDistances = [];
    let move = undefined;
    for(let item of moves){
        let prospectiveDistance = euclideanDistance(item,knightPosition);
        if(prospectiveDistance<currentDistance){ //almacenamos todos aquellos movimientos que acorten la distancia entre los personajes
            enemyDistances.push(item);
        }
    }
    if(enemyDistances.length<2){
        move = enemyDistances[0];
    }else{
        let randomNumber = diceThrow(enemyDistances.length); //cuando haya más de una distancia menor que la distancia actual se escoge por azar, ya que de elegir la 
        move = enemyDistances[randomNumber-1];               //más corta el movimiento sería demasiado predecible; en la mayoría de casos esto ayudará a evitar posibles
    }                                                        //problemas cuando los personajes se encuentren en casillas adyacentes pero diagonales.
    return move;
}

/**
 * This function checks if a string is a number
 * @param {string} string To be checked
 * @returns {boolean}
 */
function isANumber(string){
    let numberPattern = /[0-9]{1,}/;
    if(numberPattern.test(string)){
        return true;
    }else{
        return false;
    }
}

/**
 * This function returns the game parameters after asking a series of questions to the user.
 * @param {number} count The round within the game application flow.
 * @returns {array} Containing all the necessary parameters to configure the game (board size, number of players, difficulty and number of moves).
 */
function getGameParameters(count){
    let gameParameters = undefined;
    let sideNumberEntry = 0;
    let stringSideNumberEntry = '';
    if(count===0){ //si es la primera ronda una vez llamado el juego se dará más información que si no lo fuera
        stringSideNumberEntry = rl.question("\nThanks, now you will choose the board size with a number (if you introduce '7', your board will have 7x7 squares), the board can have a maximum size of 15x15. Please, introduce the board size with a number (if this is the first time you play, we recommend you press ENTER for a default 5x5 board): ");
    }else{
        stringSideNumberEntry = rl.question('\nPlease, introduce the board size with a number: ');
    }
    if(isANumber(stringSideNumberEntry)){
        sideNumberEntry = parseInt(stringSideNumberEntry);
    }
    while((!(isANumber(stringSideNumberEntry)) && (sideNumberEntry<5 || sideNumberEntry>15)) || (sideNumberEntry<5 || sideNumberEntry>15)){
        if(stringSideNumberEntry.length===0){                                                             //Damos al usuario la posibilidad de equivocarse y volver a
            stringSideNumberEntry = '5'; //default                                                        //empezar, pudiendo introducir 'q' para salir en cualquier
            sideNumberEntry = parseInt(stringSideNumberEntry);                                            //momento y teniendo en cuenta que el usuario puede equivocarse,
        }else if(!(isANumber(stringSideNumberEntry))){                                                    //volverse a equivocar, introducir un caracter no esperado,
            stringSideNumberEntry = rl.question('\nThat is not a number, please introduce a number: ');   //introducir un número fuera de rango, etc. Este bucle tiene
            if(isANumber(stringSideNumberEntry)){                                                         //todo eso en cuenta
                sideNumberEntry = parseInt(stringSideNumberEntry);
            }
        }else{
            stringSideNumberEntry = rl.question('\nSorry, there was an error. Please, ensure you introduce a number between 5 and 15: ');
            if(isANumber(stringSideNumberEntry)){
                sideNumberEntry = parseInt(stringSideNumberEntry);
            }
        }
    }
    if(sideNumberEntry>7){                      //unos avisos para que el tablero se visualice bien si tiene muchas casillas y no salga distorsionado
        let adviceMessage = undefined;          //de nuevo los mensajes varían un poco si es la primera ronda o no
        if(count===0){
            adviceMessage = rl.question("\nThat's a big number! Please, ensure you zoom out your terminal a few times to visualise the board properly. If you find that you cannot visualize the board properly, we advice you to introdcue 'q' and you will be able to quit and restart the game, zooming out a few more times this time. Press ENTER once this has been done. ");
        }else{
            adviceMessage = rl.question('\nRemember to zoom out your terminal!')
        }
        while(adviceMessage.length>0){
            adviceMessage = rl.question('\nThat operation cannot be carried out, please press ENTER once the terminal has been zoomed out. ');
        }
    }
    let stringNumberOfPlayers = rl.question('\nPlease, introduce number of players (1/2): ');       //segundo parámetro del juego, número de jugadores
    while(stringNumberOfPlayers!=='1' && stringNumberOfPlayers!=='2'){
        stringNumberOfPlayers = rl.question("\nSorry, there was an error. Please, ensure you introduce '1' or '2' ");
    }
    let numberOfPlayers = parseInt(stringNumberOfPlayers);
    let mode = ''; //string vacío si hay 2 jugadores (si el siguiente condicional no se cumple)
    if(numberOfPlayers===1){                                                                        //si hay un solo jugador se escoge la IA básica o la IA avanzada
        mode = rl.question('\nPlease, choose mode (Easy/Difficult): ').toLowerCase();
        while(mode!=='easy' && mode!=='difficult'){
            mode = rl.question("\nSorry, there was an error. Please, ensure you introduce 'Easy' or 'Difficult'. Choose mode: ").toLowerCase();
        }
    }
    let stringNumberOfMoves = undefined;                                                            //el último parámetro del juego, el número de movimientos
    if(count===0){
        stringNumberOfMoves = rl.question("\nPlease, choose the number of moves for Mr Knight to succesfully escape (introduce a number between '8' and '100', if this is the first time you play, we recommend you press ENTER for a default 8 moves game): ");
    }else{
        stringNumberOfMoves = rl.question("\nPlease, choose number of moves (introduce a number between '8' and '100'): ");
    }
    let numberOfMoves = 0;
    if(isANumber(stringNumberOfMoves)){
        numberOfMoves = parseInt(stringNumberOfMoves);
    }
    while((!(isANumber(stringNumberOfMoves)) && (numberOfMoves<8 || numberOfMoves>100)) || (numberOfMoves<8 || numberOfMoves>100)){
        if(stringNumberOfMoves.length===0){                                                             
            stringNumberOfMoves = '8'; //default                                                        
            numberOfMoves = parseInt(stringNumberOfMoves);  
        }else if(!(isANumber(stringNumberOfMoves))){
            stringNumberOfMoves = rl.question("\nThat is not a number. Please, ensure you introduce a number between '8' and '100': ");
            if(isANumber(stringNumberOfMoves)){
                numberOfMoves = parseInt(stringNumberOfMoves);
            }
        }else{
            stringNumberOfMoves = rl.question("\nSorry, there was an error. Please, ensure you introduce a number between '8' and '100': ");
            if(isANumber(stringNumberOfMoves)){
                numberOfMoves = parseInt(stringNumberOfMoves);
            }
        }
    }
    gameParameters = [sideNumberEntry,numberOfPlayers,mode,numberOfMoves];
    return gameParameters;
}

/**
 * This function returns a correct and expected string in order to define a possible move on the board, after indicating the user the right keys and options to choose from.
 * @param {string} string The user entry string.
 * @param {array} position A pair of coordinates indicating a position to move from.
 * @param {array<array>} possibleCoordinates An array containing all the coordinates (arrays) of a given board.
 * @returns {string||array} The resulting string 'q' or a pair of coordinates (array), which will not cause a problem or a non-logical move.
 */
function getRightString(string,position,possibleCoordinates){
    let resultingString = undefined; //esta variable será bien un string, bien un array, dependiendo de la entrada por parte del usuario
    let direction = undefined;
    let coordinates = [undefined,undefined];
    if(string==='q'){ //si el usuario introduce 'q' la función simplemente devuelve 'q' para que el juego se suspenda
        resultingString = 'q';
                                    //el siguiente bucle asume que el usuario se equivoca, no obstante, si la entrada es correcta, el bucle también se aplicará porque
                                    //habiendo asignado undefined al array de coordinates, la condición de coordenada no incluida en coordenadas posibles se cumplirá
    }
    while(((string!=='2' && string!=='4' && string!=='6' && string!=='8') || isIncludedInPossibleCoordinates(coordinates,possibleCoordinates)===false) && string!=='q'){
        if(string!=='2' && string!=='4' && string!=='6' && string!=='8'){
            string = rl.question("\nThere was an error, please, remember to type '2', '4', '6' or '8' only. Direction keys reminder --> DOWNWARDS: 2 LEFT: 4 RIGHT: 6 UPWARDS: 8 ");
            if(string==='q'){                                                   
                resultingString = 'q';                                                          //únicamente los strings '2', '4', '6', '8' y 'q' son adecuados; si el 
            }else if(string==='2' && string==='4' && string==='6' && string==='8'){             //string es otro se permanece en el bucle y si el string de dirección es
                direction = parseInt(string);                                                   //correcto pero la coordenada no existe también se permanece en el bucle
                coordinates = getCoordinatesFromDirection(position,direction);
                if(isIncludedInPossibleCoordinates(coordinates,possibleCoordinates)===false){
                    string = rl.question("\nIt's not possible to move " + coordinates[2] + ", please try again. "); //indica al usuario que no es posible moverse hacia
                    if(string==='q'){                                                                               //ese lado
                        resultingString = string;
                    }
                    coordinates = [undefined,undefined]; //devolvemos a coordinates el valor anterior al bucle para asegurarnos que la condición del bucle se va a cumplir
                }else{
                    resultingString = coordinates;
                }
            }
        }else if(string==='q'){
            resultingString = 'q';
        }else{
            direction = parseInt(string);
            coordinates = getCoordinatesFromDirection(position,direction);
            if(isIncludedInPossibleCoordinates(coordinates,possibleCoordinates)===false){
                string = rl.question("\nIt's not possible to move " + coordinates[2] + ", please try again. ");
                if(string==='q'){
                    resultingString = 'q';
                }
                coordinates = [undefined,undefined];
            }else{
                resultingString = coordinates;  //al final las coordenadas a devolver las determinará esta línea (a no ser que el usuario introduzca 'q'), si el string
            }                                   //era correcto desde el principio saltará directamente aquí, y con las coordinates asignadas correctamente por la función
        }                                       //getCoordinatesFromDirection en el 'else' anterior a este 'else', dejará de cumplirse la condición del while
    }
	return resultingString;
}

/**
 * This function generates a file with the parameters of the game and the sate of the game saved at any point of the game flow.
 * @param {array} gameParameters The array containing the configuration of the game (board size, number of players, difficulty and number of moves).
 * @param {array} monstaposition A pair of coodinates to indicate Mr Monsta's position at the point of saving.
 * @param {array} knightposition A pair of coodinates to indicate Mr Knight's position at the point of saving.
 * @param {number} count The number of turns at the point of saving.
 * @param {string} characterTurn The character who saved the game, and therefore has the turn.
 * @param {string} savedBoard The string representing the board at the state of saving.
 */
function saveGame(gameParameters,monstaposition,knightposition,count,characterTurn,savedBoard){
    const fs = require('fs');
    let file = fs.openSync('savedGame.txt','r'); //se crea el fichero para lectura (si no existe) o se abre si existe
    let line = fs.readFileSync(file,'utf-8');
    if(line.length>0){ 
        let erase = fs.openSync('savedGame.txt','w'); 
        fs.writeFileSync(erase,'',undefined,'utf-8'); //si el fichero tiene algún contenido se machaca antes de guardar la partida actual
        fs.closeSync(erase);
    }
    fs.closeSync(file);
    let saveGameArray = gameParameters.concat(monstaposition).concat(knightposition).concat(count).concat(characterTurn).concat(savedBoard);
    file = fs.openSync('savedGame.txt','a');
    for(let item of saveGameArray){
        let stringItem = item.toString() + ','; //el separador de strings será un coma
        fs.appendFileSync(file,stringItem,undefined,'utf-8'); //añadimos los elementos del array sin machacar el anterior
    }
    fs.closeSync(file);
}

/**
 * This function retrieves a saved file and returns an array with the game parameters and state in which it was saved.
 */
function recoverSavedGame(){
    let savedGameArray = [];
    let file = fs.openSync('savedGame.txt','r');
    let line = fs.readFileSync(file,'utf-8');
    for(let item of line.split(',')){
        savedGameArray.push(item);
    }
    fs.closeSync(file);
    let gameParameters = [parseInt(savedGameArray[0]),parseInt(savedGameArray[1]),savedGameArray[2],parseInt(savedGameArray[3])];
    let monstaposition = [parseInt(savedGameArray[4]),parseInt(savedGameArray[5])];
    let knightposition = [parseInt(savedGameArray[6]),parseInt(savedGameArray[7])];
    let count = parseInt(savedGameArray[8]);
    let characterTurn = savedGameArray[9]
    let savedBoard = savedGameArray[10]
    let recoveredGame = [gameParameters,monstaposition,knightposition,count,characterTurn,savedBoard];
    let erase = fs.openSync('savedGame.txt','w'); 
    fs.writeFileSync(erase,'',undefined,'utf-8'); //una vez los parámetros han sido recuperados borramos el contenido del fichero
    fs.closeSync(erase);
    return recoveredGame;
}

console.log("\n--.--|   |,---.    ,---..    ,,---.,---.|.    ,,---.    |   /,   .|,---.|   |--.--\n  |  |---||---     |--- |    ||---|`---.||    ||---     |__/ |\\  |||  _.|---|  |  \n  |  |   ||        |     \\  / |   |    || \\  / |        |  \\ | \\ |||   ||   |  |  \n  `  `   '`---'    `---'  `'  `   '`---'`  `'  `---'    `   ``  `'``---'`   '  `  ");
        //nombre del juego en ASCII


let initialMessage = rl.question('\nWelcome to The Evasive Knight! Before starting, bring the terminal to its maximum possible size, press ENTER once this has been done. ');
while(initialMessage.length>0){
    initialMessage = rl.question('\nThat operation cannot be carried out, please press ENTER once the terminal has its maximum size. ');
}
let game = undefined;
let exit = false;                                           
let roundCount = 0; //el número de ronda (se preguntará al final si se quiere volver a jugar, dependiendo del número de ronda se lanzarán unas preguntas u otras)                                         
let gameBoard = undefined;
let possCoordinates = [];                                   //cuando asigno un string vacío a una variable en lugar de 'undefined' es porque voy a necesitar ese string
let allGameParameters = ['','','','','',''];                //en algunas ocasiones para que métodos como .toString() no causen errores
let recover = '';
let savedGameExists = fs.openSync('savedGame.txt','a');
fs.appendFileSync(savedGameExists,'',undefined,'utf-8');    //crea el fichero para guardar, si ya existiera uno, añade un string vacío al final que no cambia nada
fs.closeSync(savedGameExists);
while(exit===false){
    let mrKnightPosition = []; //posición de partida de Mr Knight
    let mrMonstaPosition = []; //posición de partida de Mr Monsta
    let savedGameCheck = fs.openSync('savedGame.txt','r');              //se comprueba si existe una partida guardada antes de hacer otras preguntas
    let emptySavedGame = fs.readFileSync(savedGameCheck,'utf-8');
    let save = undefined;
    fs.closeSync(savedGameCheck);
    let turnCount = undefined; //número de turnos hasta que Mr Knight gana por haber escapado
    if(emptySavedGame.length>0){ //si hay algo guardado preguntamos si se quiere recuperar la partida
        recover = rl.question('\nDo you want to recover a saved game?(Yes/No) ').toLowerCase();
        while(recover!=='yes' && recover!=='no'){
            recover = rl.question('\nSorry, there was an error. Do you want to recover a saved game? (Yes/No) ').toLowerCase();
        }
        if(recover==='yes'){
            allGameParameters = recoverSavedGame();
            game = allGameParameters[0]; //asignamos los parámetros de configuración
            mrMonstaPosition = allGameParameters[1]; //asignamos los demás parámetros de estado de la partida
            mrKnightPosition = allGameParameters[2];
            turnCount = allGameParameters[3];
            possCoordinates = getPossibleCoordinates(game[0]);
        }else{
            game = getGameParameters(roundCount); //dependiendo de la ronda, la función hará más o menos explicaciones sobre cómo funciona el juego
            turnCount = 1; //si no recuperamos una partida y su turno, el turno empieza por 1
            possCoordinates = getPossibleCoordinates(game[0]);
            let knightRandomPosition = diceThrow(possCoordinates.length);
            let monstaRandomPosition = diceThrow(possCoordinates.length);
            while(knightRandomPosition===monstaRandomPosition){
                monstaRandomPosition = diceThrow(possCoordinates.length);
            }
            mrKnightPosition = possCoordinates[knightRandomPosition-1]; //obtenemos posiciones aleatorias de los personajes una vez se conoce el tablero
            mrMonstaPosition = possCoordinates[monstaRandomPosition-1];
        }
    }else{
        game = getGameParameters(roundCount);
        turnCount = 1;
        possCoordinates = getPossibleCoordinates(game[0]);
        let knightRandomPosition = diceThrow(possCoordinates.length);
        let monstaRandomPosition = diceThrow(possCoordinates.length);
        while(knightRandomPosition===monstaRandomPosition){
            monstaRandomPosition = diceThrow(possCoordinates.length);
        }
        mrKnightPosition = possCoordinates[knightRandomPosition-1];
        mrMonstaPosition = possCoordinates[monstaRandomPosition-1];
    }
    let knightPreviousCoordinates = mrKnightPosition;
    if(recover==='' || recover==='no' || (recover==='yes' && allGameParameters[4]==='MrKnight')){ //si el juego no se ha recuperado o si no hay partida guardada (recover==='') o si en la partida recuperada el turno era de Mr Knight
        gameBoard = getBoard(game[0],mrMonstaPosition,mrKnightPosition); //dibujamos el tablero usando posiciones de partida antes de que el juego empiece (pueden ser posiciones del juego guardado)
    }else{
        gameBoard = allGameParameters[5] //asignamos el tablero recuperado de guardar la partida, si existe y si el turno era para Mr Monster, así evitamos dibujar un tablero con la posición de Mr Knight (mrKnightPosition) indicando a Mr Monsta dónde iba a moverse Mr Knight, pero la intención
    }                                    //de movimiento de Mr Knight de la partida guardada sigue asignada a mrKnightPosition, que vamos a utilizar para dibujar el tablero una vez Mr Monsta mueva.
    if(recover!=='yes' && roundCount===0){
        console.log('\nGreat. Mr Knight has '+game[3]+' turns to escape. Mr Monsta will not know where Mr Knight is going to move until he moves as well. Nor will Mr Knight!');
    }else{
        let turnsLeft = game[3] - turnCount + 1
        console.log('\nGreat. Mr Knight has '+turnsLeft+' turns to escape.')
    }
    let begin = rl.question('\nBEGIN!!!\n(press ENTER)').toLowerCase();
    while(begin.length>0){
        begin = rl.question('\nSorry, there was an error. Do you want to recover a saved game? (Yes/No) ').toLowerCase();
    }
    console.log(gameBoard);
    let winner = undefined;
    let mrKnightCoordinates = [undefined,undefined]; //coordenadas de la posición de llegada de knight      //aunque este grupo de variables resulten algo redundantes
    let mrMonstaCoordinates = [undefined,undefined]; //coordenadas de la posición de llegada de monsta      //junto a mrMonstaPosition y mrKnightPosition definidas más
    let mrKnightDirection = undefined; //dirección de movimiento de knight                                  //arriba, hace falta diferenciar bien las posiciones de
    let mrMonstaDirection = undefined; //dirección de movimiento de monsta                                  //partida, llegada (que usamos para dibujar el tablero) y las 
    while(turnCount<=game[3]){                                                                              //indicaciones de dirección, así no machacamos el valor de las 
        winner = 'Mr Knight'; //si monsta no lo atrapa winner es Mr Knight                                  //variables con valores nuevos demasiado pronto con posible
                                                                                                            //pérdida de información
        if((recover==='' || recover==='no' || (recover==='yes' && allGameParameters[4]==='MrKnight')) || (recover==='yes' && turnCount>allGameParameters[3])){ //explicado una líneas más abajo
            if((roundCount===0 && turnCount===1) || (roundCount===0 && recover==='yes' && allGameParameters[3]>=turnCount)){ //si es la primera ronda y el primer turno, o la primera ronda pero recuperamos partida y no ha pasado ningún turno desde que la recuperamos, indicamos los botones de dirección
                mrKnightDirection = getRightString(rl.question("\nIt's Mr Knight's turn to move, indicate direction with your number pad (2: down, 4: left, 6: right, 8:up) or introduce 'q' to quit: "),mrKnightPosition,possCoordinates);
            }else{ //en el resto de casos se recordarán los botones de dirección sólo si el usuario se equivoca
                mrKnightDirection = getRightString(rl.question("\nIt's Mr Knight's turn to move, indicate direction: "),mrKnightPosition,possCoordinates);
            }
            if(mrKnightDirection==='q'){                                                            //EL IF MÁS COMPLEJO DE ARRIBA SE EXPLICA AQUÍ!!!
                save = rl.question('\nDo you want to save the game? ').toLowerCase();               //para que Mr Knight empiece primero se precisa que no haya partida
                if(save==='yes'){                                                                   //guardada o que esta no se haya recuperado, o que se haya recuperado
                    saveGame(game,mrMonstaPosition,mrKnightPosition,turnCount,'MrKnight','');       //pero el turno era de Mr Knight (por tanto le toca mover ahora) o
                }else if(save==='no'){                                                              //que se haya recuperado pero ya haya pasado un turno (iteración)
                    winner = 'Mr Monsta';                                                           //desde que el juego se recuperó
                }else{ //si Mr Knight se va sin guardar el ganador es Mr Monsta
                    console.log('\nSorry, there was an error. Saved by default.');
                    saveGame(game,mrMonstaPosition,mrKnightPosition,turnCount,'MrKnight',''); //cuando Mr Knight guarda no hace falta guardar el string que representa el
                }                                                                             //tablero porque el turno está sincronizado (ni Mr Knight ni Mr Monsta han
                break;                                                                        //movido en este turno) y basta con los parámetros 2 y 3; asignamos '' al
            }                                                                                 //parametro del tablero
            mrKnightCoordinates = mrKnightDirection; //cuando tenemos valores correctos para la dirección del movimiento los asignamos a coordinates, que se usará para dibujar el tablero                         
            if(turnCount===1 || (recover==='yes' && allGameParameters[4]==='MrKnight')){ //si es el primer turno no podemos todavía asignar las coordenadas de llegada usando las funciones getRightString, getMove ni getSmartMove y
                mrMonstaCoordinates = mrMonstaPosition; //tenemos que darle valores correctos a mrMonstaCoordinates para que el bucle 4 líneas más abajo funcione en el 
            }                                           //primer turno
            knightPreviousCoordinates = mrKnightPosition; //retenemos el valor de la posición anterior de Mr Knight, para usarlo en el bucle 2 líneas más abajo
            mrKnightPosition = [mrKnightCoordinates[0],mrKnightCoordinates[1]]; //asignamos nueva posición de partida para que sea usada el turno (iteración) siguiente
            while(mrMonstaCoordinates[0]===mrKnightCoordinates[0] && mrMonstaCoordinates[1]===mrKnightCoordinates[1]){ //si la posición de llegada de Mr Knight es la posición en la que se encuentra Mr Monsta
                mrKnightDirection = getRightString(rl.question("\nIt's not possible to move to Mr Monsta's current position: "),knightPreviousCoordinates,possCoordinates);
                if(mrKnightDirection==='q'){                                                                //atención, usamos knightPreviousCoordinates en la función 
                    save = rl.question('\nDo you want to save the game? ').toLowerCase();                   //getRightString dos líneas más arriba, esta variable procedía 
                    if(save==='yes'){                                                                       //de mrKnightPosition, que a su vez volvemos a usar dentro de  
                        saveGame(game,mrMonstaPosition,mrKnightPosition,turnCount,'MrKnight','');           //este bucle; importante no mezclar variables de forma que las
                    }else if(save==='no'){                                                                  //funciones y las condiciones no se apliquen correctamente
                        winner = 'Mr Monsta';
                    }else{
                        console.log('\nSorry, there was an error. Saved by default.');
                        saveGame(game,mrMonstaPosition,mrKnightPosition,turnCount,'MrKnight','');         
                    }                                                                                     
                    break;                                                                                
                }else{
                    mrKnightCoordinates = mrKnightDirection;                                              
                    mrKnightPosition = [mrKnightCoordinates[0],mrKnightCoordinates[1]];                   
                }
            }
        }
        if(game[1]===2){ //para dos jugadores, el código para los movimientos de Mr Monsta sigue la misma lógica que con Mr Knight
            if((roundCount===0 && turnCount===1) || (roundCount===0 && recover==='yes' && allGameParameters[3]>=turnCount)){
                mrMonstaDirection = getRightString(rl.question("\nIt's Mr Monsta's turn to move, indicate direction with your number pad (2: down, 4: left, 6: right, 8:up) or introduce 'q' to quit: "),mrMonstaPosition,possCoordinates);
            }else{ 
                mrMonstaDirection = getRightString(rl.question("\nIt's Mr Monsta's turn to move, indicate direction: "),mrMonstaPosition,possCoordinates);
            }
            if(mrMonstaDirection==='q'){
                save = rl.question('\nDo you want to save the game? ').toLowerCase();
                if(save==='yes'){
                    saveGame(game,mrMonstaPosition,mrKnightPosition,turnCount,'MrMonsta',gameBoard);        //cuando Mr Monsta guarda, el turno no está sincronizado, Mr
                }else if(save!=='no'){                                                                      //Knight ya ha movido y Mr Monsta todavía no, por tanto,
                    console.log('\nSorry, there was an error. Saved by default.');                          //guardamos 'gameBoard' que aún mantiene la posición de partida
                    saveGame(game,mrMonstaPosition,mrKnightPosition,turnCount,'MrMonsta',gameBoard);        //de Mr Monsta (para dibujar el tablero al recuperar el juego)
                }                                                                                           //pero la intención de movimiento de Mr Knight se guarda en
                break;                                                                                      //'mrKnightPosition'
            }
            mrMonstaCoordinates = mrMonstaDirection; //variable que usamos para dibujar el tablero más adelante
        }else if(game[1]===1){
            if(game[2]==='easy'){
                mrMonstaCoordinates = getMove(mrMonstaPosition,game[0]);
            }else if(game[2]==='difficult'){
                mrMonstaCoordinates = getSmartMove(knightPreviousCoordinates,mrMonstaPosition,game[0]); //usamos knightPreviousCoordinates porque Mr Monsta no sabe dónde
            }                                                                                           //ha movido Mr Knight
        }
        mrMonstaPosition = [mrMonstaCoordinates[0],mrMonstaCoordinates[1]];
        gameBoard = getBoard(game[0],mrMonstaPosition,mrKnightPosition)
        turnCount++; //sumamos turnos antes de imprimir el tablero, para indicarlo en la impresión
        let turnsLeft = game[3] - turnCount + 1;
        console.log(gameBoard+'\nTurns left: '+turnsLeft); //finalmente se imprime el tablero cuando ambos personajes han movido
        if(mrMonstaCoordinates[0]===mrKnightCoordinates[0] && mrMonstaCoordinates[1]===mrKnightCoordinates[1]){ 
            winner = 'Mr Monsta'; //una vez Mr Knight y Mr Monsta se encuentran en la misma casilla, gana Mr Monsta
            break;
        }
    }
    if(save!=='yes'){ //si no se guarda se muestra el ganador
        console.log('\nThe winner is ' + winner + '!!!');
    }
    let playAgain = rl.question('\nDo you want to play again? (Yes/No) ');
    if(playAgain.toLowerCase()==='yes'){
        exit = false;
    }else if(playAgain.toLowerCase()==='no'){
        exit = true;
    }else{
        playAgain = rl.question('\nSorry, it looks like there was an error, please try again. Do you want to play again? (Yes/No) ');
        if(playAgain.toLowerCase()==='yes'){
            exit = false;
        }else if(playAgain.toLowerCase()==='no'){
            exit = true;
        }else{
            console.log('\nSorry, it looks like there was an error again. Quitting...')
        }
    }
    roundCount++;
}