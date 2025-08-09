let selectedNoteId = null

document.querySelectorAll('.savedDraft').forEach((el) => {
    el.addEventListener('click', function(e) {
        e.preventDefault()

        document.querySelectorAll('.savedDraft').forEach(link => {
            link.classList.remove('selected-note')
        })

        this.classList.add('selected-note')

        selectedNoteId = this.dataset.id
        const noteText = this.dataset.fullnote

        document.getElementById('new-btn').textContent = "Update"

        document.getElementById("text-note").value = noteText

        document.getElementById('noteId').value = selectedNoteId
    })
})

function deleteNote() {
    if (selectedNoteId === null) {
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
    const idHidden = document.getElementById('new-note-id')

    noteHidden.value = note

    if (selectedNoteId !== null) {
        idHidden.value = selectedNoteId
    }
})