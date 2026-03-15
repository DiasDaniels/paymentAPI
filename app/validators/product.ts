import vine from '@vinejs/vine'


export const productValidator = vine.create({
    name: vine.string(),
    amount: vine.number().min(0)
  })