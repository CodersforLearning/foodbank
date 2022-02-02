import React, { useCallback, useEffect, useState } from 'react'
import FoodGroups from 'components/FoodGroups'
import Draggable from '@components/FoodGroups/Draggable'
import { FoodGroupCharacterImage } from '@components/FoodGroups/Draggable/types'
import { Vector2 } from '@components/FoodGroups/Draggable/boundingbox'
import { State_ } from '@components/FoodGroups/types'
import { Button, Modal } from '@components/Custom'

import { Client } from '@notionhq/client/build/src'
import {
  getCharacterData,
  getFormatData
} from '@components/FoodGroups/API/getData'
import { FOOD_GROUPS, GROUPS } from '@components/FoodGroups/groups'
import { ACHIEVEMENT, useFirebase } from '@components/FirebaseContext'
import Auth from '@components/Auth'

// FIXME: Hack to ensure function uses updated state variables
const updatedFunction = (f: Function) => {
  const [rerender, setRerender] = useState(0)
  useEffect(() => {
    f()
  }, [rerender])
  return () => setRerender(rerender + 1)
}

const N_DRAGGABLE = 5

const newArray = (v: any) => Array(N_DRAGGABLE).fill(v)

function generateCharacterSet(character_data: FoodGroupCharacterImage[]) {
  const characterSet: FoodGroupCharacterImage[] = []

  const filterFunction = (type: string) =>
    character_data.filter(character => character.type === type)

  const characters = FOOD_GROUPS.map(group => filterFunction(group))

  characters.forEach(characterTypeSet =>
    characterSet.push(
      characterTypeSet[Math.floor(Math.random() * characterTypeSet.length)]
    )
  )

  return characterSet
}

interface Props {
  notion_character_data: FoodGroupCharacterImage[]
}

const FoodGroupsPage: React.FC<Props> = ({ notion_character_data }: Props) => {
  const { achievements, updateAchievementsDocument, user } = useFirebase()

  const [modalState, setModalState] = useState(false)
  const [selectedDraggableType, setSelectedDraggableType] = useState(
    GROUPS.NONE
  )

  // GAME STATE
  const [hoverType, setHoverType] = useState(GROUPS.DEFAULT)
  const [roundCounter, setRoundCounter] = useState(0)

  // This keeps the number of wins while signed out so when the user logs in it gets added to their score
  const [roundCounterSignedOut, setRoundCounterSignedOut] = useState(0)

  const [correctDraggables, setCorrectDraggables] = useState(newArray(false))
  const [wheelEnabled, setWheelEnabled] = useState(true)
  const [currentCharSet, setCharSet] = useState<FoodGroupCharacterImage[]>(
    generateCharacterSet(notion_character_data)
  )
  const [nextCharSet, setNextCharSet] = useState<FoodGroupCharacterImage[]>(
    generateCharacterSet(notion_character_data)
  )
  const [overridePosition, setOverridePosition] = useState({ x: 0, y: 0 })
  const [switchCharSet, setSwitchCharSet] = useState(true)

  // SIGN IN FORM
  const [openSignInForm, setOpenSignInForm] = useState(false)

  const toggleOpenSignInForm = useCallback(() => {
    setOpenSignInForm(prev => !prev)
  }, [])

  const draggablePositions: State_<Vector2>[] = []
  const draggablePositions_2: State_<Vector2>[] = []
  var draggables: JSX.Element[] = []
  var draggables_2: JSX.Element[] = []

  const endDragF = (index: number) => {
    if (hoverType === selectedDraggableType) {
      correctDraggables[index] = true // CORRECT ANSWER
    } else if (hoverType !== GROUPS.NONE) {
      correctDraggables[index] = false // WRONG ANSWER
      // RESET POSITION
      draggablePositions[index][1](draggables[index].props.start_pos)
      draggablePositions_2[index][1](draggables_2[index].props.start_pos)
    }

    // CHECK FOR END OF ROUND
    if (correctDraggables.every((v: boolean) => v)) {
      // END OF ROUND
      setRoundCounter(roundCounter + 1)
      if (!user) {
        setRoundCounterSignedOut(roundCounterSignedOut + 1)
      }
      updateAchievementsDocument?.({
        // If achievements based on the number of wins should be implemented in the future.
        [ACHIEVEMENT.DRAG_DROP_WIN_COUNT]:
          achievements[ACHIEVEMENT.DRAG_DROP_WIN_COUNT] + 1,
        // For now, achivements is just the amount of game wins
        [ACHIEVEMENT.ACHIEVEMENT_COUNT]:
          achievements[ACHIEVEMENT.ACHIEVEMENT_COUNT] + 1
      })
      setWheelEnabled(false)
      setModalState(true)
    }
    setOverridePosition({ x: 0, y: 0 })
    setHoverType(GROUPS.NONE)
    setSelectedDraggableType(GROUPS.NONE)
    setCorrectDraggables(correctDraggables)
  }

  // ON THE END OF A ROUND, PERFORM THESE ACTIONS
  const resetGame = () => {
    if (roundCounter === 0) return
    // alert(`Round complete!${roundCounter}`)
    setModalState(false)
    setWheelEnabled(true)
    setCorrectDraggables(correctDraggables.fill(false))
    draggablePositions.forEach((state, i) =>
      state[1](draggables[i].props.start_pos)
    )
    draggablePositions_2.forEach((state, i) =>
      state[1](draggables_2[i].props.start_pos)
    )
    // setCharSet(nextCharSet)
    // setNextCharSet(generateCharacterSet(notion_character_data))
    if (switchCharSet) {
      setCharSet(generateCharacterSet(notion_character_data))
    } else {
      setNextCharSet(generateCharacterSet(notion_character_data))
    }
    setSwitchCharSet(!switchCharSet)
    // console.log(switchCharSet, setCharSet, nextCharSet)
  }

  currentCharSet.map((character, index) => {
    draggablePositions[index] = useState<Vector2>(character.start_pos)
    draggables[index] = (
      <Draggable
        key={index}
        onEndDrag={updatedFunction(() => {
          endDragF(index)
        })}
        onStartDrag={() => {
          setOverridePosition({ x: 0, y: 0 })
          setSelectedDraggableType(character.type)
        }}
        screenPosition={draggablePositions[index][0]}
        setScreenPosition={draggablePositions[index][1]}
        setAbsPosition={setOverridePosition}
        hidden={!switchCharSet}
        {...character}
      />
    )
  })

  nextCharSet.map((character, index) => {
    draggablePositions_2[index] = useState<Vector2>(character.start_pos)
    draggables_2[index] = (
      <Draggable
        key={index}
        onEndDrag={updatedFunction(() => {
          endDragF(index)
        })}
        onStartDrag={() => {
          setSelectedDraggableType(character.type)
        }}
        screenPosition={draggablePositions_2[index][0]}
        setScreenPosition={draggablePositions_2[index][1]}
        setAbsPosition={setOverridePosition}
        hidden={switchCharSet}
        {...character}
      />
    )
  })

  useEffect(() => {
    if (user && roundCounterSignedOut > 0) {
      updateAchievementsDocument?.({
        [ACHIEVEMENT.DRAG_DROP_WIN_COUNT]:
          achievements[ACHIEVEMENT.DRAG_DROP_WIN_COUNT] + roundCounterSignedOut,
        // For now, achivements is just the amount of game wins
        [ACHIEVEMENT.ACHIEVEMENT_COUNT]:
          achievements[ACHIEVEMENT.ACHIEVEMENT_COUNT] + roundCounterSignedOut
      })
      setRoundCounterSignedOut(0) // Reset count so it doesn't get 'double added' if a person relogs
    }
  }, [roundCounterSignedOut, achievements]) // Do not include user - user triggers update BEFORE achievements is updated with online data

  return (
    <>
      {modalState && (
        <Modal heading={'You won!'} open={true} onClose={resetGame} size='lg'>
          <div className='flex items-center flex-col'>
            <h1>
              You have completed {roundCounter} rounds in this game
              {user !== null ? ' - you have earned a new trophy!' : ''}
            </h1>
            <h2>
              {user !== null
                ? `You have won ${
                    achievements[ACHIEVEMENT.DRAG_DROP_WIN_COUNT]
                  } rounds in total!`
                : 'Sign into your account to save your progress!'}
            </h2>
            <br />
            {user === null ? (
              <button className='animate-bounce' onClick={toggleOpenSignInForm}>
                Sign-in
              </button>
            ) : (
              ''
            )}
            <Button className='flex items-center uppercase' onClick={resetGame}>
              next round
            </Button>
          </div>
        </Modal>
      )}
      <Auth open={openSignInForm && !user} onClose={toggleOpenSignInForm} />
      <div className='flex justify-start max-w-[100vh]' draggable={false}>
        <div className='grid grid-cols-1 w-[90vh]' draggable={false}>
          <FoodGroups
            overrideMouse={selectedDraggableType !== GROUPS.NONE}
            overrideMousePosition={overridePosition}
            setHoverType={setHoverType}
            enabled={wheelEnabled}
          />
          {draggables}
          {draggables_2}
        </div>
      </div>
    </>
  )
}
export const getServerSideProps = async () => {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })

  const { data } = await getCharacterData()

  const notion_character_data: FoodGroupCharacterImage[] = getFormatData(data)

  return {
    props: {
      notion_character_data
    }
  }
}

export default FoodGroupsPage
