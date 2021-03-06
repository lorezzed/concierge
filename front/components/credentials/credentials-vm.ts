import * as ko from 'knockout'
import * as fs from 'fs'
import createCreds from './create'
import edit from './edit'
import state from '../state'
import menu from '../menu'

class Credentials {
  credentials = state.credentials

  showCreateModal = createCreds.showModal
  showEditModal = edit.editCredentials

  refresh = () => state.getApplications()

  removeCredentials = async (creds: Concierge.Credentials) => {
    await fetch(`/api/credentials/${creds.id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(res => state.toast.primary(res.message))

    this.refresh()
  }
}

const viewModel = new Credentials()

ko.components.register('ko-credentials', {
  template: fs.readFileSync(`${__dirname}/credentials.html`).toString(),
  viewModel: {
    createViewModel: () => viewModel
  }
})

menu.register(
  {
    path: '/credentials',
    item: { component: 'ko-credentials', name: 'Credentials' }
  }
)