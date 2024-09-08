$(document).ready(function() {
    /* Variables */
    const totalTime = 180;
    var timeLeft = totalTime;
    var timerInterval;
    var cardValues = [];
    var flippedCards = [];
    var lockBoard = false;
    var matchedPairs = 0;
    var moves = 0;
    var folder = "computerHardware";
    var cardBack = "linusTechTips";
    const totalPairs = 20;
    const musicNumber = 5;
    var musicFiles = [];

    function startGame(){
        // Initialize Timer and Cards
        $('#themeSelector').prop('disabled', true);
        updateTimerDisplay();
        playRandomMusic();
        setTimeout(() => {
            generateCards();
            $('#gameContainer').on('click', '.card', flipCard);
            $('#themeButton').fadeOut();
        }, 700);
        // Activate card clicks
        
    }

    /* Music Randomizer */
    function playRandomMusic(){
        for(let i = 0; i < musicNumber; i++){
            musicFiles.push(`Music/${folder}/song${i+1}.mp3`);
        }
        const randomIndex = Math.floor(Math.random() * musicFiles.length);
        const selectedMusic = musicFiles[randomIndex];
        const audioElement = $('#gameMusic')[0];
        audioElement.src = selectedMusic;
        audioElement.play();
    }

    function startTimer(){
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            // Detects Loss Due to Time
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameOver();
            }
        }, 1000);
    }
    //converts seconds to minutes and seconds
    function updateTimerDisplay(){
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        $('#timer').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    function gameOver(){
        // Disable card interactions
        $('.card').off('click');
        alert('Time is up! Game over.');
    }

    function checkForVictory(){
        // Check if all cards are matched
        if (matchedPairs == totalPairs) {
            clearInterval(timerInterval);
            $('.card').off('click'); // Disable further interactions

            if(moves > 40){
                $('#moveLine').html('You won in <span id="moves-count"></span> moves');
                $('.retry').html('Play Again');
                $('#moves-count').text(moves.toString());
            }    
            window.location.hash = '#victoryScreen';
        }
    }

    // creates an array named cardValues, which allows the cards to be matched
    function generateCards(){
        for (let i = 0; i < 20; i++) {
            cardValues[i] = (i + 1) + ".png";
        }

        // array shuffle algorithm
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // doubles each card value
        var cardsArray = [...cardValues, ...cardValues];

        // shuffles the cardValues array
        cardsArray = shuffleArray(cardsArray);

        // generates the cards
        const rows = 5;
        const cols = 8;
        var htmlContent = '';
        var imageIndex = 0;

        for (let i = 0; i < rows; i++) {
            htmlContent += `<div class="row">\n`;
            for (let j = 0; j < cols; j++) {
                const randomImage = cardsArray[imageIndex];
                imageIndex++;

                // Add `data-image` attribute to cardSection for comparison
                htmlContent += `
                <div class="card">
                    <div class="cardSection" data-image="${randomImage}">
                        <div class="cardFront" style="background-image: url(Images/${cardBack}.png); background-size: contain;"></div>
                        <div class="cardBack" style="background-image: url(Images/${folder}/${randomImage}); background-size: contain;"></div>
                    </div>
                </div>
                `;
            }
            htmlContent += `\n</div>`;
        }

        $('#gameContainer').html(htmlContent).hide().fadeIn();
        $('.cardSection').addClass('flipped');
        setTimeout(() => {
            $('.cardSection').removeClass('flipped');
            resetBoard();
            timeLeft = totalTime;
            startTimer();
        }, 1000);
    }

    function flipCard() {
        // Prevent flipping if the board is locked or if this card is already flipped
        if (lockBoard || $(this).find('.cardSection').hasClass('flipped')) return;
    
        const cardSection = $(this).find('.cardSection');
        cardSection.addClass('flipped');
        flippedCards.push(cardSection);
        moves++;
    
        // If two cards are flipped, check for a match
        if (flippedCards.length === 2) {
            lockBoard = true; // Lock the board until check completes
            checkForMatch();
        }
    }

    function checkForMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
    
        const image1 = card1.data('image');
        const image2 = card2.data('image');
    
        if (image1 === image2) {
            // Cards match
            setTimeout(() => {
                card1.removeClass('flipped');
                card2.removeClass('flipped');
                setTimeout(() => {
                    card1.hide(); // Hide the matched cards
                    card2.hide();
                }, 600);
    
                matchedPairs++;
                checkForVictory();
                resetBoard(); // Unlock the board
            }, 1000); // Delay to allow the user to see the matched cards
        } else {
            // Cards don't match, flip them back after a delay
            setTimeout(() => {
                card1.removeClass('flipped');
                card2.removeClass('flipped');
                resetBoard(); // Unlock the board after the flip back
            }, 1000); // Delay to let the user see both cards
        }
    }    

    function resetBoard() {
        flippedCards = [];
        lockBoard = false;
    }
    function gameOver() {
        revealAllCards();

        // Disable card interactions
        $('.card').off('click');
        alert('Time is up! Game over.');
    }

    function revealAllCards() {
        $('.cardSection').each(function() {
            $(this).addClass('flipped');
        });
    }
    
    $('#startButton').on('click', startGame);
    $('#startButton').click(function() {
        $(this).fadeOut();
        $(this).prop('disabled', true);
    });

    $('.retry').click(function() {
        window.location.href = 'index.html';
    });

    // EXTRAS
    $('#themeSelector').click(function() {
        const isChecked = $('#themeSelector').prop('checked');
        if (isChecked) {
            // Checkbox is checked
            folder = "starterPokemon";
            cardBack = "pokeBall";
            $('#titleHeader').html("Starter Pokemon Memory Game");
        } else {
            // Checkbox is not checked
            folder = "computerHardware";
            cardBack = "linusTechTips";
            $('#titleHeader').html("Computer HardWare Memory Game");
        }
    });
});