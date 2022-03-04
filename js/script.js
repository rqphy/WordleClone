/**
 * Functions
 */
const startInteraction = () =>
{
    document.addEventListener('click', handleMouseClick)
    document.addEventListener('keydown', handleKeyPress)
}

const stopInteraction = () =>
{
    document.removeEventListener('click', handleMouseClick)
    document.removeEventListener('keydown', handleKeyPress)
}

const handleMouseClick = (_event) =>
{
    const target = _event.target
    if(target.matches('[data-key]'))
    {
        pressKey(target.dataset.key)
        return
    }

    if(target.matches('[data-enter]'))
    {
        submitGuess()
        return
    }

    if(target.matches('[data-delete]'))
    {
        deleteKey()
        return
    }
}

const handleKeyPress = (_event) =>
{
    const key = _event.key

    if(key === 'Enter')
    {
        submitGuess()
        return
    }

    if(key === 'Backspace' || key === 'Delete')
    {
        deleteKey()
        return
    }

    if(key.match(/^[a-z]$/))
    {
        pressKey(key)
        return
    }
}

const pressKey = (key) =>
{
    // Limit typing length
    const activeTiles = getActiveTiles()
    if(activeTiles.length >= WORD_LENGTH) return

    const nextTile = guessGrid.querySelector(':not([data-letter])')
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = 'active'
}

const deleteKey = () =>
{
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    // Check if at least one tile has letter
    if(lastTile == null) return

    lastTile.textContent = ''
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}

const getActiveTiles = () =>
{
    return guessGrid.querySelectorAll('[data-state="active"]')
}

const submitGuess = () => 
{
    const activeTiles = [...getActiveTiles()]

    // Case not enough letters
    if(activeTiles.length !== WORD_LENGTH)
    {
        showAlert('Not enough letters')
        shakeTiles(activeTiles)
        return
    }

    const guess = activeTiles.reduce((word, tile) =>
    {
        return word + tile.dataset.letter
    }, '')

    // Case word not in dictionary
    if(!dictionary.includes(guess))
    {
        showAlert('Not in dictionary')
        shakeTiles(activeTiles)
        return
    }

    stopInteraction()
    activeTiles.forEach((...params) => flipTile(...params, guess))
}

const flipTile = (tile, index, array, guess) =>
{
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    console.log(`[data-key="${letter}"]`)
    setTimeout(() =>
    {
        tile.classList.add('isFlop')
    }, index * FLIP_ANIMATION_DURATION / 2)

    tile.addEventListener('transitionend', () =>
    {
        tile.classList.remove('isFlop')
        if(targetWord[index] === letter)
        {
            tile.dataset.state = 'correct'
            key.classList.add('correct')
        } else if(targetWord.includes(letter))
        {
            tile.dataset.state = 'wrong_location'
            key.classList.add('wrong_location')
        } else
        {
            tile.dataset.state = 'wrong'
            key.classList.add('wrong')
        }

        if(index === array.length - 1)
        {
            tile.addEventListener('transitionend', () =>
            {
                startInteraction()
                checkWinLose(guess, array)
            }, { once: true })
        }
    }, { once: true })
}

const showAlert = (message, duration = 1000) =>
{
    // Create alert
    const alert = document.createElement('div')
    alert.textContent = message
    alert.classList.add('alert')
    alertContainer.prepend(alert)

    if(duration == null) return

    setTimeout(() =>
    {
        alert.classList.add('isOut')
        alert.addEventListener('transitionend', () =>
        {
            alert.remove()
        })
    }, duration)
}

const danceTiles = (tiles) =>
{
    tiles.forEach((tile, index) =>
    {
        setTimeout(() =>
        {
            tile.classList.add('isDancing')
            tile.addEventListener('animationend', () =>
            {
                tile.classList.remove('isDancing')
            }, { once: true })
        }, index * DANCE_ANIMATION_DURATION / 5)
    })
}

const shakeTiles = (tiles) =>
{
    for(const tile of tiles)
    {
        tile.classList.add('isShaking')
        tile.addEventListener('animationend', () =>
        {
            tile.classList.remove('isShaking')
        }, { once: true })
    }
}

const checkWinLose = (guess, tiles) =>
{
    if(guess === targetWord)
    {
        showAlert('You Won', 5000)
        danceTiles(tiles)
        stopInteraction
        return
    }

    const remainingTiles = guessGrid.querySelectorAll(':not([data-letter])')

    if(remainingTiles.length === 0)
    {
        showAlert(targetWord.toUpperCase(), null)
        stopInteraction()
    }
}

/**
 * Variables
 */
const guessGrid = document.querySelector('[data-guess_grid]')
const alertContainer = document.querySelector('[data-alert_container]')
const keyboard = document.querySelector('[data-keyboard]')

const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500

// Generate id from dayoffset
const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
const targetWord = targetWords[Math.floor(dayOffset)]

window.addEventListener('load', startInteraction)