// 1. Get the current list from browser memory
export function getLibrary() {
    const stored = localStorage.getItem('anime-library');
    return stored ? JSON.parse(stored) : [];
}

// 2. Add an anime to the list
export function addToLibrary(anime, initialStatus = 'Watching') {
    const library = getLibrary();

    // Check if it is already there to avoid duplicates
    if (library.find(item => item.id === anime.id)) {
        return false; // Already saved
    }

    // Save specific fields (we don't need the whole heavy object)
    const entry = {
        id: anime.id,
        title: anime.title.english || anime.title.romaji,
        image: anime.coverImage.extraLarge,
        status: initialStatus,
        addedAt: new Date().toISOString()
    };

    library.push(entry);
    localStorage.setItem('anime-library', JSON.stringify(library));
    return true; // Success
}

// 3. Check if an ID is saved (to change button color)
export function isSaved(id) {
    const library = getLibrary();
    return library.some(item => item.id === parseInt(id));
}

export function updateStatus(id, newStatus) {
    const library = getLibrary();
    const index = library.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
        library[index].status = newStatus;
        localStorage.setItem('anime-library', JSON.stringify(library));
        return true;
    }
    return false;
}

export function getSavedStatus(id) {
    const library = getLibrary();
    const item = library.find(i => i.id === parseInt(id));
    return item ? item.status : '';
}