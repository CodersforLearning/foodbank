import React, { MouseEventHandler, useEffect, useState } from 'react'
import { BoundingBox, inBoundingBox, Vector2 } from './boundingbox'
import styles from 'components/FoodGroups/foodgroups.module.css'
import { FoodGroupCharacterImage } from './types'

import Image from 'next/image'
import { StateDispatch } from '../types'

interface Props extends FoodGroupCharacterImage {
  onEndDrag: Function
  onStartDrag: Function
  setScreenPosition: StateDispatch<Vector2>
  setAbsPosition: StateDispatch<Vector2>
  screenPosition: Vector2
  hidden: Boolean
}

const Draggable: React.FC<Props> = (props: Props) => {
  const { screenPosition, setScreenPosition, setAbsPosition } = props
  // const [screenPosition, setScreenPosition] = useState(props.start_pos)
  const [parentRect, setParentRect] = useState<DOMRect | undefined>(undefined)
  const [delta, setDelta] = useState<Vector2 | undefined>(undefined)
  const [maxPosition, setMaxPosition] = useState({ x: 100.0, y: 100.0 })

  const [ptrEvents, setPtrEvents] = useState(true) // TODO: Check if needed

  const dragAround = (e: MouseEvent) => {
    let point: Vector2 = { x: e.clientX, y: e.clientY }
    console.log('dragaround', point)

    if (parentRect && delta) {
      setAbsPosition({
        x: e.pageX - parentRect.x + delta.x,
        y: e.pageY - parentRect.y + delta.y
      })
      let x = ((e.pageX - parentRect.x + delta.x) / parentRect.width) * 100.0
      let y = ((e.pageY - parentRect.y + delta.y) / parentRect.height) * 100.0
      if (x > maxPosition.x || y > maxPosition.y || x < 0 || y < 0) return
      setScreenPosition({ x: x, y: y })
    } else {
      console.error('[ ERROR ]: Parent element bb does not exist')
    }
  }

  const stopDrag = () => {
    // setHoverTypeMutex(true)
    props.onEndDrag()
    document.removeEventListener('mousemove', dragAround)
    document.removeEventListener('mouseup', stopDrag)
    // setScreenPosition(startPosition)
    setPtrEvents(true)
  }

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // setHoverTypeMutex(false)
    console.log(props.type)
    props.onStartDrag(props.type)
    let parentRect: DOMRect
    if (e.target instanceof Element && e.target.parentElement) {
      parentRect = e.target.parentElement.getBoundingClientRect()
      setParentRect(parentRect)
    } else {
      console.error('[ ERROR ]: Parent element bb does not exist')
      return
    }
    setPtrEvents(false)
    let box: DOMRect = e.currentTarget.getBoundingClientRect()
    setDelta({ x: box.x - e.pageX, y: box.y - e.pageY })
    // let max_x = (100.0 - box.width) / parentRect.width
    // let max_y = (100.0 - box.height) / parentRect.height
    // setMaxPosition({ x: max_x, y: max_y })
  }

  const showImage = (character_image: FoodGroupCharacterImage) => {
    return (
      <Image
        src={character_image.img_src}
        alt={character_image.div_id}
        layout='fill'
        // className={}
        // useMap={/* */}
        id={`${character_image.bounding_box_id}`}
      />
    )
  }

  useEffect(() => {
    if (delta) {
      document.addEventListener('mousemove', dragAround)
      document.addEventListener('mouseup', stopDrag)
    }
  }, [delta])

  return (
    <>
      <div
        className={'z-20 ' + styles['drag-drop']}
        onMouseDown={startDrag}
        draggable={false}
        style={{
          pointerEvents: ptrEvents ? 'auto' : 'none',
          position: 'fixed', // MUST BE FIXED SO ITS COORDINATES ARE RELATIVE TO THE PAGE BASE
          left: `${screenPosition.x}%`, // % works!!
          top: `${screenPosition.y}%`,
          // backgroundColor: 'cyan',
          width: 'fit-content',
          height: 'fit-content'
        }}
      >
        <div
          className='select-none'
          style={{ zIndex: 0, pointerEvents: 'none' }}
          draggable={false}
          hidden={props.hidden}
        >
          <Image
            src={props.img_src}
            alt={props.div_id}
            width='200%'
            height='200%'
            draggable={false}
            priority={true}
          />
          {/* Line below for debugging screen position of characters */}
          {/* CurX: {screenPosition.x} CurY: {screenPosition.y} */}
        </div>
      </div>
    </>
  )
}

export default Draggable
