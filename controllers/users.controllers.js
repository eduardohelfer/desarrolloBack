const UsersService = require('../services/users.services')
const { getPagination, getPagingData } = require('../utils/sequelize-utils')


const usersService = new UsersService()

const getUsers = async (request, response, next) => {
  try {
    let query = request.query
    let { page, size } = query

    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset

    let users = await usersService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return response.json({ results: results })

  } catch (error) {
    next(error)
  }
}

const addUser = (request, response) => {
  const { first_name, last_name, email, username, password } = request.body
  if (first_name && last_name && email && username && password) {
    usersService.createUser({ first_name, last_name, email, username, password })
      .then(data => response.status(201).json(data))
      .catch(err => response.status(404).json({ message: err.message }))
  }
  else {
    response.status(400).json({
      fields: {
        message: {
          first_name: 'STRING',
          last_name: 'STRING',
          email: 'example@example.com',
          username: 'STRING',
          password: 'STRING'
        }
      }
    })
  }
}

// const addUser = async (request, response, next) => {
//   try {
//     let { firstName, lastName, email, username, password } = request.body
//     let user = await usersService.createUser({ firstName, lastName, email, username, password })
//     return response.status(201).json({ results: user })
//   } catch (error) {
//     next(error)
//   }
// }


const getUser = async (request, response, next) => {
  try {
    let id = request.params.user_id
    let users = await usersService.getUserOr404(id)
    return response.json({ results: users })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (request, response, next) => {
  try {
    let id = request.params.user_id
    let { first_name, last_name, email, username } = request.body
    let user = await usersService.updateUser(id, { first_name, last_name, email, username })
    return response.json({ results: user })
  } catch (error) {
    next(error)
  }
}

const myPublications = async (request, response, next) => {
  try {
    let id = request.user.id
    let publications = await usersService.getPublicationsOfUser(id)
    return response.json({ results: publications })
  } catch (error) {
    next(error)
  }
}

const myVotes = async (request, response, next) => {
  try {
    let id = request.user.id
    let votes = await usersService.getVotesOfUser(id)
    return response.json({ results: votes })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  addUser,
  getUser,
  updateUser,
  myPublications,
  myVotes
}