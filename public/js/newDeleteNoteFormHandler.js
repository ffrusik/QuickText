document.getElementById('new-form').addEventListener('submit', function(e) {
    const note = document.getElementById('text-note').value
    document.getElementById('new-note-hidden').value = note;
})

function deleteNote() {
    return true;
}