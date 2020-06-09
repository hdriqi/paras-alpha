import { createMemento, updateMemento, toggleFollow } from '../main'
import { Memento, mementoCollection, Img, Following, feedCollection } from '../model'
import { math, context } from 'near-sdk-as'

describe('Feed ', () => {
  it('should follow user', () => {
    const target: Following =  new Following('123', 'memento')

    toggleFollow(target)
    const feedId = math.hash(context.sender).toString()
    const feed = feedCollection.getSome(feedId)
    expect(feed.list.length).toBe(1)
  })

  it('should unfollow user', () => {
    const target: Following =  new Following('123', 'memento')

    toggleFollow(target)
    toggleFollow(target)
    const feedId = math.hash(context.sender).toString()
    const feed = feedCollection.getSome(feedId)
    expect(feed.list.length).toBe(0)
  })
})
