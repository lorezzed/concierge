import * as ko from 'knockout'
import * as fs from 'fs'
import state from '../state'

class Hosts {
  hosts = state.hosts

  modalActive = ko.observable(false)
  hostname = ko.observable('')
  capacity = ko.observable(5)
  privateKey = ko.observable('')
  password = ko.observable('')
  username = ko.observable('')
  sshPort = ko.observable(22)
  dockerPort = ko.observable(2375)

  displayAuth = ko.observable('Password')

  isPassword = ko.computed(() => this.displayAuth() === 'Password')
  isKey = ko.computed(() => this.displayAuth() === 'Key')

  useKey = () => this.displayAuth('Key') || true
  usePassword = () => this.displayAuth('Password') || true

  hideModal = () => {
    this.modalActive(false)
  }

  showModal = () => {
    this.hostname('')
    this.capacity(5)
    this.privateKey('')
    this.sshPort(22)
    this.dockerPort(2375)
    this.modalActive(true)
  }

  createHost = async () => {
    const hostname = this.hostname()
    const capacity = this.capacity() || 5
    const sshUsername = this.username()
    const sshPort = this.sshPort() || 22
    const dockerPort = this.dockerPort() || 2375
    const key = this.displayAuth() === 'key'
      ? this.privateKey()
      : this.password()

    const url = `/api/hosts`

    const result = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        hostname,
        capacity,
        dockerPort,
        sshPort,
        sshUsername,
        privateKey: key
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (result.status === 200) {
      this.hideModal()
      state.getHosts()
      state.toast.success('Successfully created host')
      return
    }

    const error = await result.json()
    state.toast.error(`Failed to create host: ${error.message}`)
  }
}

const hosts = new Hosts()

ko.components.register('ko-hosts', {
  template: fs.readFileSync(`${__dirname}/hosts.html`).toString(),
  viewModel: {
    createViewModel: () => hosts
  }
})
