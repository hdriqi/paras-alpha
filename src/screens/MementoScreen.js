import React, { useEffect, useState } from 'react'
import Memento from '../components/Memento'
import axios from 'axios'
import near from '../lib/near'
import { useSelector } from 'react-redux'

const MementoScreen = ({ id, memento = {}, postList = [] }) => {
  const me = useSelector(state => state.me.profile)
  const [localMemento, setLocalMemento] = useState(memento)
  const [localPostList, setLocalPostList] = useState(postList)
  const [localPendingPostCount, setLocalPendingPostCount] = useState(null)
  
  useEffect(() => {
    const getData = async () => {
      try {
        const memento = await near.contract.getMementoById({
          id: id
        })
        
        setLocalMemento(memento)
      } catch (err) {
        console.log(err)
      }
    }
    if(id && !memento.id) {
      console.log('get memento data')
      getData()
    }
  }, [id])

  useEffect(() => {
    const getData = async () => {
      try {
        const query = [`mementoId:=${localMemento.id}`, `status:=published`]
        const postList = await near.contract.getPostList({
          query: query,
          opts: {
            _embed: true,
            _sort: 'createdAt',
            _order: 'desc',
            _limit: 10
          }
        })

        setLocalPostList(postList)
      } catch (err) {
        console.log(err)
      }
    }
    if(localMemento.id) {
      console.log('get memento post list')
      getData()
    }
  }, [localMemento])

  useEffect(() => {
    const getData = async () => {
      const query = [`mementoId:=${localMemento.id}`, `status:=pending`]
      const postList = await near.contract.getPostList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })
      if(postList.length > 0) {
        if(postList.length > 9) {
          setLocalPendingPostCount('9+')
        }
        else {
          setLocalPendingPostCount(postList.length)
        }
      }
    }
    if(localMemento.id && me.username === localMemento.owner) {
      console.log('get memento pending post list')
      getData()
    }
  }, [localMemento, me])

  return (
    <Memento memento={localMemento} postList={localPostList} pendingPostCount={localPendingPostCount} />
  )
}

export default MementoScreen