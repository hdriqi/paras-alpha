// import { createMemento, getMementoList, getMementoById } from '../main'
// import { context } from 'near-sdk-as'
// import { Memento, store } from '../model'

// describe('Memento ', () => {
//   afterEach( () => {
//     while (store.mementoList.length > 0) {
//       store.mementoList.pop()
//     }
//   })

//   it('should create memento', () => {
//     const name = 'Hello World'
//     const desc = 'Memento test'
//     const descRaw = 'Memento test raw'
//     const type = 'public'
//     const m = createMemento(name, desc, descRaw, type)
//     expect<string>(m.name).toBe(name)
//     expect(m instanceof Memento).toBeTruthy()
//     expect(store.mementoList.length).toBe(1)
//   })

//   itThrows('should throw error Memento type', () => {
//     const name = 'Hello World'
//     const desc = 'Memento test'
//     const descRaw = 'Memento test raw'
//     const type = 'random'
//     createMemento(name, desc, descRaw, type)
//   })

//   it('should get all memento list', () => {
//     const len = 10
//     for (let i = 0; i < len; i++) {
//       const name = 'Hello World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     const result = getMementoList()
//     expect(result.length).toBe(len)
//   })

//   it('should get memento list by name', () => {
//     for (let i = 0; i < 3; i++) {
//       const name = 'Hello World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     for (let i = 0; i < 5; i++) {
//       const name = 'Another World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     const result = getMementoList({
//       name: 'Hello World',
//       nameLike: null,
//       owner: null,
//       _sort: null,
//       _order: null,
//       _limit: 10
//     })
//     expect(result.length).toBe(3)
//   })

//   it('should get memento list by name like', () => {
//     for (let i = 0; i < 3; i++) {
//       const name = 'Hello World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     for (let i = 0; i < 3; i++) {
//       const name = 'Another World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     const result = getMementoList({
//       name: null,
//       nameLike: 'world',
//       owner: null,
//       _sort: null,
//       _order: null,
//       _limit: 10
//     })
//     expect(result.length).toBe(6)
//   })

//   it('should get memento list by owner', () => {
//     for (let i = 0; i < 3; i++) {
//       const name = 'Hello World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     const result = getMementoList({
//       name: null,
//       nameLike: null,
//       owner: context.sender,
//       _sort: null,
//       _order: null,
//       _limit: 10
//     })
//     expect(result.length).toBe(3)
//   })

//   it('should get memento list with sort by desc', () => {
//     for (let i = 0; i < 3; i++) {
//       const name = 'Hello World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     const result = getMementoList({
//       name: null,
//       nameLike: null,
//       owner: null,
//       _sort: 'createdAt',
//       _order: 'desc',
//       _limit: 10
//     })
//     expect(result[0].createdAt).toBeGreaterThanOrEqual(result[1].createdAt)
//   })

//   it('should get memento list with limit', () => {
//     for (let i = 0; i < 10; i++) {
//       const name = 'Hello World'
//       const desc = 'Memento test'
//       const descRaw = 'Memento test raw'
//       const type = 'public'
//       createMemento(name, desc, descRaw, type)
//     }
//     const result = getMementoList({
//       name: null,
//       nameLike: null,
//       owner: null,
//       _sort: null,
//       _order: null,
//       _limit: 3
//     })
//     expect(result.length).toBe(3)
//   })

//   it('should get memento by id', () => {
//     const name = 'Hello World'
//     const desc = 'Memento test'
//     const descRaw = 'Memento test raw'
//     const type = 'public'
//     const m = createMemento(name, desc, descRaw, type)
//     const result = getMementoById(m.id)
//     if(result) {
//       expect(result.name).toBe(m.name)
//     }
//     else {
//       expect(result).toBe(null)
//     }
//   })
// })
