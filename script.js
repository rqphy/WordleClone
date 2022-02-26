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
}

/**
 * Variables
 */
const guessGrid = document.querySelector('[data-guess_grid]')
const WORD_LENGTH = 5

// Generate id from dayoffset
const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
const targetWord = targetWords[Math.floor(dayOffset)]

window.addEventListener('load', startInteraction)