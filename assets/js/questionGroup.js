;(function () {
  const table = document.getElementById('questionGroups')

  let order = []
  let listItems = document.getElementsByClassName('question-group')

  const saveButtonDefaultText = 'Save group order'
  const saveButton = document.getElementById('save-group-order')
  const saveButtonError = document.getElementById('save-group-order-error')

  saveButton.setAttribute('disabled', 'disabled')
  saveButton.innerText = saveButtonDefaultText

  for (const item of listItems) {
    order.push(item.dataset.id)
  }

  Sortable.create(table, {
    draggable: '.draggable',
    ghostClass: 'draggable--ghost', // Class name for the drop placeholder
    chosenClass: 'draggable--chosen', // Class name for the chosen item
    dragClass: 'draggable--move', // Class name for the dragging item
    onChange: function () {
      order = this.toArray()
      saveButton.removeAttribute('disabled')
      saveButton.innerText = saveButtonDefaultText
      console.log('changed')
    },
  })

  if (saveButton) {
    const saveGroupOrder = function (event) {
      event.preventDefault()

      console.log(order)

      const token = document.getElementById('csrf').dataset.csrf
      const group = document.getElementById('group-uuid').dataset.group

      const req = new XMLHttpRequest()

      req.addEventListener('load', function (res) {
        if (this.status !== 200) {
          console.log('None 200 response when updating group order')
          saveButtonError.classList.remove('govuk-visually-hidden')
          saveButtonError.innerText = this.responseText || 'Something went wrong updating the group'
          return
        }
        saveButtonError.classList.add('govuk-visually-hidden')
        saveButton.setAttribute('disabled', 'disabled')
        saveButton.innerText = 'Group updated'
      })

      req.addEventListener('error', function () {
        console.log('Request to update failed')
        saveButtonError.classList.remove('govuk-visually-hidden')
        saveButtonError.innerText = 'Request failed'
      })

      req.open('POST', '/questions/group/' + group + '/update')
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      req.setRequestHeader('X-CSRF-Token', token)
      req.withCredentials = true
      req.send(JSON.stringify(order))
    }

    saveButton.onclick = saveGroupOrder
  }
})()
