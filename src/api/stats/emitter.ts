import * as events from 'events'
import { socket } from '../../server'

const emitter = new events.EventEmitter()

export function container(subdomain: string, event: any) {
  emitter.emit('container', subdomain, event)
}

export function containerStats(subdomain: string, stats: any) {
  emitter.emit('container-stats', subdomain, stats)
}

export function host(hostname: string, event: any) {
  emitter.emit('host', hostname, event)
}

export function build(name: string, event: any) {
  emitter.emit('build', name, event)
}

emitter.addListener('container', (subdomain, event) => {
  socket.emit('event', newEvent(subdomain, 'Container', event))
})

emitter.addListener('host', (hostname, event) => {
  socket.emit('event', newEvent(hostname, 'Host', event))
})

emitter.addListener('build', (name, event) => {
  socket.emit('build', newEvent(name, 'Build', event))
})

emitter.addListener('container-stats', (subdomain, stats) => {
  socket.emit('stats', newEvent(subdomain, 'Container', stats))
})

function newEvent(name: string, type: string, event: string) {
  return { name, type, event }
}