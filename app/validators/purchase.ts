import vine from '@vinejs/vine'

export const purchaseValidator = vine.create({
    name: vine.string(),
    email:  vine.string(),
    cardNumber: vine.string(),
    cvv: vine.string(),
    products:  vine.array(vine.object({
        id: vine.number(),
        quantity: vine.number().min(1)
    }))
  })