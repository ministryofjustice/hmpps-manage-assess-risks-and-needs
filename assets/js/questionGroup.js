;(function () {
  const table = document.getElementById('questionGroups')

  Sortable.create(table, {
    draggable: '.draggable',
    ghostClass: 'draggable--ghost', // Class name for the drop placeholder
    chosenClass: 'draggable--chosen', // Class name for the chosen item
    dragClass: 'draggable--move', // Class name for the dragging item
    onUpdate: function () {
      const order = this.toArray()
      console.log(order)
    },
  })
})()
