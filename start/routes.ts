import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'


router
  .group(() => {

    //Rotas Públicas
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('purchase', [controllers.Purchase, 'store'])
      })
      
    //Rotas Privadas  
    router
      .group(() => {
        //Auth
        router.get('account/profile', [controllers.Profile, 'show'])
        router.post('account/logout', [controllers.AccessToken, 'destroy'])

        //Gateways
        router.patch('gateways/:id/toggle', [controllers.Gateway, 'toggle'])
        router.patch('gateways/:id/priority', [controllers.Gateway, 'priority'])

        //Usuários
        router.get('users', [controllers.User, 'index'])
        router.get('users/:id', [controllers.User, 'show'])
        router.post('users', [controllers.User, 'store'])
        router.put('users/:id', [controllers.User, 'update'])
        router.delete('users/:id', [controllers.User, 'destroy'])

        //Produtos
        router.get('products', [controllers.Product, 'index'])
        router.get('products/:id', [controllers.Product, 'show'])
        router.post('products', [controllers.Product, 'store'])
        router.put('products/:id', [controllers.Product, 'update'])
        router.delete('products/:id', [controllers.Product, 'destroy'])

        //Clientes
        router.get('clients', [controllers.Client, 'index'])
        router.get('clients/:id', [controllers.Client, 'show'])
 
        //Transações
        router.get('transactions', [controllers.Transaction, 'index'])
        router.get('transactions/:id', [controllers.Transaction, 'show'])
        router.post('transactions/:id/charge_back', [controllers.Transaction, 'refund'])
        
      })
      .use(middleware.auth())

  })
  .prefix('/api/')
