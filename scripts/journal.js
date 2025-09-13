const journalJson = {};


function fetchJournal() {
    //we will fetch from a open github json repository if the user does not have a local copy and or the local copy is older than 1 day
    const localJournal = localStorage.getItem("journal");
    const localJournalTime = localStorage.getItem("journalTime");
    const now = new Date().getTime();

    if (localJournal && localJournalTime && now - localJournalTime < 86400000) {
        //if the local copy is less than 1 day old, use it
        Object.assign(journalJson, JSON.parse(localJournal));
        displayJournal();
        return;
    }

    //if the local copy is older than 1 day, fetch a new copy /// for now we are just using the local /pages/components/journal/journal.json file
    fetch("/pages/components/journal/journal.json")
        .then(response => response.json())
        .then(data => {
            Object.assign(journalJson, data);
            localStorage.setItem("journal", JSON.stringify(data));
            localStorage.setItem("journalTime", now);
            displayJournal();
        });
}