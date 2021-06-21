;(function () {
  const questionGroups = document.getElementsByClassName('question-group')

  console.log('found ' + questionGroups.length + ' questions')

  for (const question of questionGroups) {
    const contentUuid = question.dataset.id

    console.log('Finding editor elements for ' + contentUuid)

    const editPanel = document.getElementById('edit-' + contentUuid)
    const displayPanel = document.getElementById('element-' + contentUuid)

    function showEditor() {
      editPanel.classList.remove('govuk-visually-hidden')
      displayPanel.classList.add('govuk-visually-hidden')
    }

    function hideEditor() {
      displayPanel.classList.remove('govuk-visually-hidden')
      editPanel.classList.add('govuk-visually-hidden')
    }

    const openEditorButton = document.getElementById('open-edit-' + contentUuid)
    const closeEditorButton = document.getElementById('close-edit-' + contentUuid)

    openEditorButton.onclick = function (e) {
      e.preventDefault()
      showEditor()
    }

    closeEditorButton.onclick = function (e) {
      e.preventDefault()
      e.stopPropagation()
      hideEditor()
    }

    const form = document.getElementById('form-' + contentUuid)

    if (openEditorButton && closeEditorButton && form) {
      console.log('Setting up editor controls for ' + contentUuid)

      form.onsubmit = function (e) {
        e.preventDefault()

        const formData = new FormData(form)
        const action = form.getAttribute('action')
        const token = document.getElementById('csrf').dataset.csrf

        const notificationWrapper = document.getElementById('notification-wrapper-' + contentUuid)
        const notification = document.getElementById('notification-' + contentUuid)

        function setNotification(message, successfulState = true) {
          notificationWrapper.classList.remove('govuk-visually-hidden')
          notification.innerText = message
          if (successfulState) {
            notification.classList.remove('question-group__notification--failure')
            notification.classList.add('question-group__notification--success')
          } else {
            notification.classList.remove('question-group__notification--success')
            notification.classList.add('question-group__notification--failure')
          }
        }

        const req = new XMLHttpRequest()

        req.addEventListener('load', function (res) {
          if (this.status !== 200) {
            console.log('None 200 response when updating question')
            setNotification('Failed to update question', false)
            return
          }
          const questionPreview = document.getElementById('preview-' + contentUuid)

          const safeHtml = DOMPurify.sanitize(req.responseText, { USE_PROFILES: { html: true } })
          questionPreview.innerHTML = safeHtml
          setNotification('Question updated')
          hideEditor()
        })

        req.addEventListener('error', function () {
          console.log('Request to update question failed')
          setNotification('Request failed', false)
        })

        const requestBody = {}

        requestBody.questionText = formData.get('question-text')
        requestBody.helpText = formData.get('help-text')
        requestBody.type = formData.get('answer-type')
        requestBody.answerGroup = formData.get('answer-group')
        requestBody.oasysQuestionCode = formData.get('oasys-question-code')
        requestBody.referenceDataCategory = formData.get('reference-data-category')
        requestBody.questionRules = formData.getAll('question-rules')

        req.open('POST', action)
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        req.setRequestHeader('X-CSRF-Token', token)
        req.withCredentials = true
        req.send(JSON.stringify(requestBody))
      }
    }
  }
})()
