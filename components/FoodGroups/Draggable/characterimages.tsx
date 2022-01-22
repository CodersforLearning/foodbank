import dairy from 'public/images/Food Characters/Cheese Chessy.png'
import meat from 'public/images/Food Characters/Meat Lean.png'
import fruit from 'public/images/Food Characters/Apple-Aces.png'
import vegetable from 'public/images/Food Characters/Sweat Potato Footy Girl.png'
import grain from 'public/images/Food Characters/Bread Mixed Grain.png'

import dairy_1 from 'public/images/Food Characters/Milk Mighty 2.png'
import meat_1 from 'public/images/Food Characters/Fish Flying.png'
import fruit_1 from 'public/images/Food Characters/Banana Super Fruity.png'
import vegetable_1 from 'public/images/Food Characters/Cucumber Business.png'
import grain_1 from 'public/images/Food Characters/Bread Toasty.png'

import { FoodGroupCharacterImage } from './types'
import { DAIRY, FRUIT, GRAINS, MEAT, VEGETABLES } from '../groups'
import { getFormatData } from '../API/getData'


// const foodGroupsCharacterImages: FoodGroupCharacterImage[] = getFormatData()

let notion_food_dict = new Map<string, string>([
  ['Vegetables – protective foods', 'vegetables'],
  ['Breads and Cereals – Energy Foods', 'grain'],
  ['Dairy foods – body building', 'dairy'],
  ['Meat/Protein – body building', 'meat'],
  ['Fruit – Protective foods', 'fruit']
]);


const foodGroupsCharacterImages: FoodGroupCharacterImage[] = [
  {
    div_id: 'dairy-character',
    img_src: dairy.src,
    img_id: 'dairy-character-img',
    bounding_box_id: 0,
    type: DAIRY,
    start_pos: { x: 90, y: 2 }
  },
  {
    div_id: 'meat-character',
    img_src: meat.src,
    img_id: 'meat-character-img',
    bounding_box_id: 1,
    type: MEAT,
    start_pos: { x: 90, y: 20 }
  },
  {
    div_id: 'fruit-character',
    img_src: fruit.src,
    img_id: 'fruit-character-img',
    bounding_box_id: 2,
    type: FRUIT,
    start_pos: { x: 90, y: 40 }
  },
  {
    div_id: 'vegetable-character',
    img_src: vegetable.src,
    img_id: 'vegetable-character-img',
    bounding_box_id: 3,
    type: VEGETABLES,
    start_pos: { x: 90, y: 60 }
  },
  {
    div_id: 'grain-character',
    img_src: grain.src,
    img_id: 'grain-character-img',
    bounding_box_id: 4,
    type: GRAINS,
    start_pos: { x: 90, y: 80 }
  },
  {
    div_id: 'dairy-character',
    img_src: dairy_1.src,
    img_id: 'dairy-character-img',
    bounding_box_id: 0,
    type: 'dairy',
    start_pos: { x: 90, y: 2 }
  },
  {
    div_id: 'meat-character',
    img_src: meat_1.src,
    img_id: 'meat-character-img',
    bounding_box_id: 1,
    type: 'meat',
    start_pos: { x: 90, y: 20 }
  },
  {
    div_id: 'fruit-character',
    img_src: fruit_1.src,
    img_id: 'fruit-character-img',
    bounding_box_id: 2,
    type: 'fruit',
    start_pos: { x: 90, y: 40 }
  },
  {
    div_id: 'vegetable-character',
    img_src: vegetable_1.src,
    img_id: 'vegetable-character-img',
    bounding_box_id: 3,
    type: 'vegetables',
    start_pos: { x: 90, y: 60 }
  },
  {
    div_id: 'grain-character',
    img_src: grain_1.src,
    img_id: 'grain-character-img',
    bounding_box_id: 4,
    type: 'grains',
    start_pos: { x: 90, y: 80 }
  }
]



const getAllRecipes = async () => {
  let data = await notion.databases.query({
    database_id: process.env.NOTION_RECIPES_DB_ID ?? ''
  })

  // pre filter the original data, making sure there's no entries with empty properties
  const filtered_data = data.results.filter(result => {
    if (!('properties' in result)) return
    const CategoryProp = result.properties?.Category
    const RecipeProp = result.properties?.Recipe
    const EquipmentProp = result.properties?.Equipment
    const characterIdProp = result.properties?.characterId
    const colorSchemeProp = result.properties?.colorScheme
    const equipmentImgProp = result.properties?.equipmentImg
    const finalShotProp = result.properties?.finalShot
    const ingredientsProp = result.properties?.ingredients
    const ingredientsImgProp = result.properties?.ingredientsImg
    const slugProp = result.properties?.slug
    return (
      (CategoryProp?.type === 'multi_select'
        ? CategoryProp.multi_select[0]
        : undefined) !== undefined &&
      (RecipeProp?.type === 'title'
        ? RecipeProp.title[0].plain_text
        : undefined) !== undefined &&
      (EquipmentProp?.type === 'multi_select'
        ? EquipmentProp.multi_select[0]
        : undefined) !== undefined &&
      (characterIdProp?.type === 'relation'
        ? characterIdProp.relation[0]
        : undefined) !== undefined &&
      (colorSchemeProp?.type === 'rich_text'
        ? colorSchemeProp.rich_text[0].plain_text
        : undefined) !== undefined &&
      (equipmentImgProp?.type === 'files'
        ? equipmentImgProp.files[0]
        : undefined) !== undefined &&
      (finalShotProp?.type === 'files' ? finalShotProp.files[0] : undefined) !==
        undefined &&
      (ingredientsProp?.type === 'multi_select'
        ? ingredientsProp.multi_select[0]
        : undefined) !== undefined &&
      (ingredientsImgProp?.type === 'files'
        ? ingredientsImgProp.files[0]
        : undefined) !== undefined &&
      (slugProp?.type === 'rich_text'
        ? slugProp.rich_text[0].plain_text
        : undefined) !== undefined
    )
  })
  const recipes = filtered_data.map(recipe => {
    if (!('properties' in recipe)) return {}
    const nameProp = recipe.properties.Recipe
    const categoryProp = recipe.properties.Category
    const tagsProp = recipe.properties.Tags
    const equipmentProp = recipe.properties.Equipment
    const ingredientsProp = recipe.properties.ingredients
    const equipmentImgProp = recipe.properties.equipmentImg
    const ingredientsImgProp = recipe.properties.ingredientsImg
    const finalShotProp = recipe.properties.finalShot
    const colorSchemeProp = recipe.properties.colorScheme
    const hintProp = recipe.properties.hint
    const slugProp = recipe.properties.slug
    const characterIdProp = recipe.properties.characterId
    return {
      page_id: recipe.id,
      name: nameProp.type === 'title' ? nameProp.title[0].plain_text : '',
      category:
        categoryProp.type === 'multi_select'
          ? categoryProp.multi_select.map(category => category.name)
          : [],
      tags:
        tagsProp.type === 'multi_select'
          ? tagsProp.multi_select.map(tag => tag.name)
          : [],
      equipment:
        equipmentProp.type === 'multi_select'
          ? equipmentProp.multi_select.map(item => item.name)
          : [],
      ingredients:
        ingredientsProp.type === 'multi_select'
          ? ingredientsProp.multi_select.map(item => item.name)
          : [],
      equipmentImg:
        equipmentImgProp.type === 'files'
          ? equipmentImgProp.files[0].type === 'file'
            ? equipmentImgProp.files[0].file.url
            : ''
          : '',
      ingredientsImg:
        ingredientsImgProp.type === 'files'
          ? ingredientsImgProp.files[0].type === 'file'
            ? ingredientsImgProp.files[0].file.url
            : ''
          : '',
      finalShot:
        finalShotProp.type === 'files'
          ? finalShotProp.files[0].type === 'file'
            ? finalShotProp.files[0].file.url
            : ''
          : '',
      colorScheme:
        colorSchemeProp.type === 'rich_text'
          ? colorSchemeProp.rich_text[0].plain_text
          : '',
      hint:
        hintProp.type === 'rich_text'
          ? hintProp.rich_text[0]
            ? hintProp.rich_text[0].plain_text
            : ''
          : '',
      slug:
        slugProp.type === 'rich_text' ? slugProp.rich_text[0].plain_text : '',
      character: getCharacterProps(
        characterIdProp.type === 'relation'
          ? characterIdProp.relation[0].id
          : ''
      ),
      characterId:
        characterIdProp.type === 'relation'
          ? characterIdProp.relation[0].id
          : ''
    }
  })

  return { recipes }

}

export { foodGroupsCharacterImages ,notion_food_dict }
