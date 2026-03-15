import vine from '@vinejs/vine'

export const gatewayValidator = vine.create({
    priority: vine.number().min(1),
})