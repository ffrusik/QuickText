let selectedNoteIndex = null

document.querySelectorAll('.savedDraft').forEach((el) => {
    el.addEventListener('click', function(e) {
        e.preventDefault()

        document.querySelectorAll('.savedDraft').forEach(link => {
            link.classList.remove('selected-note')
        })

        this.classList.add('selected-note')

        selectedNoteIndex = this.dataset.index
        const noteText = this.dataset.fullnote

        document.getElementById('new-btn').textContent = "Update"

        document.getElementById("text-note").value = noteText

        document.getElementById('noteIndex').value = selectedNoteIndex
    })
})

function deleteNote() {
    if (selectedNoteIndex === null) {
        alert('Please select a draft to delete')
        return false
    }

    return true
}

function addNote() {
    if (document.getElementById('text-note').value == '') {
        alert('Cannot create an empty draft')
    }
}

document.getElementById('new-form').addEventListener('submit', function(e) {
    const note = document.getElementById('text-note').value
    const noteHidden = document.getElementById('new-note-hidden')
    const indexHidden = document.getElementById('new-note-index')

    noteHidden.value = note

    if (selectedNoteIndex !== null) {
        indexHidden.value = selectedNoteIndex
    }
})