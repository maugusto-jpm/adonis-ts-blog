/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', 'HomeController.index')
// Route.on('/').render('pages/home')

Route.get('/', 'HomeController.index')

Route.get('/postagens', 'PostsController.index')
Route.get('/fazer-uma-postagem', 'PostsController.newPost')
Route.post('/fazer-uma-postagem', 'PostsController.create').middleware('auth')

Route.on('/entrar').render('pages/login')
Route.on('/cadastrar-se').render('pages/signup')
Route.post('/users/login', 'UsersController.login')
Route.get('/sair', 'UsersController.logout')
Route.post('/users/store', 'UsersController.store')

// Only to populate Database
Route.get('/users/populate', 'UsersController.populate')

// Route.get('/users', 'UsersController.index')
// Route.post('/users', 'UsersController.store')

// Route.post('/login', 'AuthController.login')

// Route.get('/dashboard', 'DashboardController.index').middleware('auth')
