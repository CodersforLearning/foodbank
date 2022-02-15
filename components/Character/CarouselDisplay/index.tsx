import React, { ReactNode, FC } from 'react'
import type { Character } from 'lib/types'
interface CarouselProps {
  maxPerPage: number
  children?: ReactNode
  chr?: Character[]
}

/** The single-page view of character images and buttons which navigate to individual character pages. */
const CarouselDisplay = ({ maxPerPage, ...props }: CarouselProps) => {
  // Assuming we're still using PurgeCSS so can't do 'grid-cols-' + maxPerPage
  const gridColsClass: string = maxPerPage === 4 ? 'grid-cols-4' : ''
  return (
    <div className='inline-block'>
      <div className={'grid ' + gridColsClass}>
        {React.Children.map(props.children, child => {
          return (
            <div>
              {React.cloneElement(
                child as React.DetailedReactHTMLElement<any, HTMLElement>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CarouselDisplay
