import { MouseEventHandler, PropsWithChildren } from 'react';
import { Transition } from 'react-transition-group'
import './index.scss'

export default function ModalWrapper(props: PropsWithChildren<{ visible?: boolean, close?: () => void }>) {
  const onClick: MouseEventHandler = (event) => {
    if(event.target === event.currentTarget) {
      props.close()
    }
  }

  return (
    <Transition in={props.visible} timeout={300}>
      {props.visible ? <div className="modal" onClick={onClick}>{props.children}</div> : <></>}
    </Transition>
  )
}