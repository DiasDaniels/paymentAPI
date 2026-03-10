/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from './kernel.ts'


router
  .group(() => {

    //Rotas Públicas
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
      })
      
    //Rotas Privadas  
    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessToken, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

  })
  .prefix('/api/')
