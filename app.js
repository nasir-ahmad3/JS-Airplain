const myPlane = document.querySelector('.my-plane');
const rocket = document.querySelector('div.screen > div.rocket');
const scoreContainer = document.querySelector('div.screen > div.score > span');
const bestScoreContainer = document.querySelector('div.screen > div.bestScore > span');
const StartGameBtn = document.querySelector('.startGame > .btn-start')
const gameOver = document.querySelector('.gameOver')
const RestartGameBtn = document.querySelector('div.btn-start:nth-child(4)')
const backgroundAudio = document.getElementById('bg-audio')
const LoseAudio = document.getElementById('lose-audio')
const soundControl = document.querySelector('.sound-control')

let XAxis = -45;
let baseSpeed = 5; // Initial speed in pixels
let speedIncrement = 5; // Speed increase per interval
let movingLeft = false;
let movingRight = false;
let speedupInterval; // Store the interval reference
let currentSpeed = baseSpeed; // Track the current speed
let score = 0;
let planeMoving = true; // Flag to control plane movement
let rocketSpeed = 1000 / 200; // Base rocket speed
let isMoved = true
let isMovedCounter = 0
 

Array.from(soundControl.children).forEach(con => {
    con.addEventListener('click', e => {
        if (con.classList.contains('volume-high')){
            console.log('muted')
            muteAll()
            con.classList.remove('active')
            con.nextElementSibling.classList.add('active')
        }else{
            console.log('unmuted')
            unmuteAll()
            con.classList.remove('active')
            con.previousElementSibling.classList.add('active')
        }
    })
})

function playAudio() {
    backgroundAudio.play();
}

function pauseAudio() {
    backgroundAudio.pause();
}

function restartAudio() {
    backgroundAudio.currentTime = 0;
}

function playLoseAudio() {
    LoseAudio.currentTime = 0;
    LoseAudio.play();

}

function pauseLoseAudio() {
    LoseAudio.currentTime = 0;
    LoseAudio.pause()
}

function restartLoseAudio() {
    LoseAudio.currentTime = 0;
}
function muteAll() {
    // Mute all audio elements
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => audio.muted = true);

    // Mute all video elements
    const videos = document.querySelectorAll('video');
    videos.forEach(video => video.muted = true);
}

function unmuteAll() {
    // Unmute all audio elements
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => audio.muted = false);

    // Unmute all video elements
    const videos = document.querySelectorAll('video');
    videos.forEach(video => video.muted = false);
}
function isMute() {
    // Check if all audio and video elements are muted
    const audios = document.querySelectorAll('audio');
    const videos = document.querySelectorAll('video');

    // Check if any audio or video element is unmuted
    let allMuted = true;
    audios.forEach(audio => {
        if (!audio.muted) {
            allMuted = false;
        }
    });

    videos.forEach(video => {
        if (!video.muted) {
            allMuted = false;
        }
    });

    return allMuted;
}

function setTheBestScore(){
    try{
        BestScore = Number(localStorage.getItem('bestScore'))
        bestScoreContainer.textContent = BestScore
    }
    catch (error){
        BestScore = 0
    }

}
setTheBestScore()
// Initial position of the plane
myPlane.style.transform = `translateX(${XAxis}px)`;

// Update function to move the plane
function updatePlanePosition() {
    if (planeMoving) { // Only move the plane if it's not stopped
        if (movingLeft) {
            XAxis >= -window.innerWidth / 2 ? XAxis -= currentSpeed : XAxis;
        }
        if (movingRight) {
            XAxis <= window.innerWidth / 2 - 100 ? XAxis += currentSpeed : XAxis;
        }

        myPlane.style.transform = `translateX(${XAxis}px)`;
    }
    requestAnimationFrame(updatePlanePosition); // Keep the loop going
}

// Start the update loop
requestAnimationFrame(updatePlanePosition);

// Event listeners for key down and key up
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !movingLeft) {
        movingLeft = true;
        currentSpeed = baseSpeed; // Reset to base speed
        startSpeedup(speedIncrement); // Start decreasing speed
    } else if (e.key === 'ArrowRight' && !movingRight) {
        movingRight = true;
        currentSpeed = baseSpeed; // Reset to base speed
        startSpeedup(speedIncrement); // Start increasing speed
    }
    isMoved = true
    isMovedCounter = 0
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        movingLeft = false;
    } else if (e.key === 'ArrowRight') {
        movingRight = false;
    }

    isMoved = false

    // Reset speed when both keys are released
    if (!movingLeft && !movingRight) {
        clearInterval(speedupInterval);
        currentSpeed = baseSpeed; // Reset to initial speed
    }
});

// Function to manage speedup
function startSpeedup(amount) {
    if (speedupInterval) {
        clearInterval(speedupInterval); // Clear any existing intervals
    }

    speedupInterval = setInterval(() => {
        currentSpeed += amount; // Adjust speed by the specified amount
        // Prevent negative speed
        if (currentSpeed < 1) {
            currentSpeed = 1; // Set a minimum speed limit
        }
    }, 100); // Adjust interval timing as needed (100ms for smoother acceleration)
}

// Rocket movement logic
let rocketmover;
let minimumHorizontal = -50;
let currentHorizontal = -50;
let maxHorizontal = 100;

function setTheScore(){
    scoreContainer.textContent = score;
}

function MoveRocket() {
    currentHorizontal = -50;
    
    // Update rocket speed based on score: higher score = faster rocket
    let currentRocketSpeed = 100-score; // Speed caps at a minimum interval of 100ms

    rocketmover = setInterval(() => {
        if (currentHorizontal <= maxHorizontal) {
            currentHorizontal += 10;
            rocket.style.top = `${currentHorizontal}%`;
            crashCheck();
        } else {
            crashCheck();
            // Reset position and randomize horizontal position when it reaches max
            currentHorizontal = minimumHorizontal;
            score += 1;
            setTheScore()
            
            if (!isMoved && score >= 1  && isMovedCounter >= 3){
                AimToPlane()
            }else{
                rocket.style.left = `${Math.random() * 100}%`;
                isMovedCounter+=1
            }
            // Adjust rocket speed with increasing score
            clearInterval(rocketmover);
            MoveRocket();
            
        }
    }, currentRocketSpeed);
}


// Function to stop the rocket movement
function StopRocket() {
    clearInterval(rocketmover);
}

// Function to stop the plane movement
function StopPlain() {
    planeMoving = false; // Stop the plane's movement
}

// Function to start the plane movement
function startPlain() {
    planeMoving = true; // Start the plane's movement
}

function stopGame(){
    StopPlain()
    StopRocket()
}
stopGame()
function StartGame(){
    startPlain()
    MoveRocket()
    restartAudio()
    playAudio()
    pauseLoseAudio()
    isMovedCounter = 0
}
StartGameBtn.addEventListener('click', e => {
    StartGameBtn.parentElement.classList.add('deactive')
    StartGame()
})

RestartGameBtn.addEventListener('click', e => {
    RestartGameBtn.parentElement.classList.remove('active')
    rocket.style.left = '30%'
    rocket.style.top = '-50%'
    XAxis = -45;
    StartGame()
})
// Collision detection function
function crashCheck() {
    const planRect = myPlane.getBoundingClientRect();
    const planX = planRect.left + window.scrollX;
    const planY = planRect.top + window.scrollY;

    const RocketRect = rocket.getBoundingClientRect();
    const RocketX = RocketRect.left + window.scrollX;
    const RocketY = RocketRect.top + window.scrollY;

    if (RocketX >= planX - 50 && RocketX <= planX + 50 && planY + 50 >= RocketY && RocketY >= planY - 50) {
        StopRocket();
        StopPlain();
        if (score > BestScore){
            localStorage.setItem('bestScore', JSON.stringify(score))
        }
        setTheBestScore()
        gameOver.classList.add('active')
        gameOver.children[1].children[0].textContent = score
        gameOver.children[2].children[0].textContent = BestScore
        score = 0
        setTheScore()
        pauseAudio()
        playLoseAudio()
    }
}


function AimToPlane() {
    const planeRect = myPlane.getBoundingClientRect();
    const planeX = planeRect.left + window.scrollX;  // Plane's X position in px

    // const rocketRect = rocket.getBoundingClientRect();
    const containerRect = rocket.parentElement.getBoundingClientRect();  // Assuming both are inside the same container
    // console.log('planeX:', planeX);

    // Convert planeX (in px) to a percentage relative to the container width
    const planeXPercent = (planeX / containerRect.width) * 100;
  

    // Set rocket position in percentage
    rocket.style.left = `${planeXPercent+3}%`;
}

function isComputer() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for mobile or tablet keywords in the user agent
    const isMobile = /iphone|ipad|ipod|android|blackberry|opera mini|iemobile|mobile|tablet/i.test(userAgent);

    // If no mobile or tablet keywords are found, it's a computer
    return !isMobile;
}

if (!isComputer()) {
    document.querySelector('.screen').style.display = 'none';
    let alertbox = document.createElement('div')
    alertbox.classList.add('alert')
    alertbox.textContent = "This game only run's on computers."
    document.querySelector('body').appendChild(alertbox)
    
    
} 


