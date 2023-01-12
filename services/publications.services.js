const uuid4 = require('uuid')
const Publications = require('../database/models/publications')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/custom-error')

class PublicationsServices {

  constructor() {

  }

  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` }
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const publications = await Publications().findAndCountAll(options)
    return publications
  }

  async createPublication(obj) {
    const transaction = await Publications().sequelize.transaction()
    try {
      let newPublication = await Publications().create({
        id: uuid4(),
        profile_id: obj.profile_id,
        publication_type_id: obj.publication_type_id,
        title: obj.title,
        description: obj.description,
        content: obj.content,
        picture: obj.picture,
        city_id: obj.city_id,
        image_url: obj.image_url
      }, { transaction })

      await transaction.commit()
      return newPublication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async getPublicationOr404(id) {
    let publication = await Publications().findByPk(id)

    if (!publication) throw new CustomError('Not found Publication', 404, 'Not Found')

    return publication
  }

  async getAllPublications() {
    let publication = await Publications().findAll()
    return publication
  }


  async getPublication(id) {
    let publication = await Publications().findByPk(id, { raw: true })
    return publication
  }

  async updatePublication(id, obj) {
    const transaction = await Publications().sequelize.transaction()
    try {
      let publications = await Publications().findByPk(id)

      if (!publications) throw new CustomError('Not found publications', 404, 'Not Found')

      let updatedPublication = await publications.update({
        publication_type_id: obj.publication_type_id,
        title: obj.title,
        description: obj.description,
        content: obj.content,
        picture: obj.picture,
        city_id: obj.city_id,
        image_url: obj.image_url
      }, { transaction })

      await transaction.commit()

      return updatedPublication

    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removePublication(id) {
    const transaction = await Publications().sequelize.transaction()
    try {
      let publication = await Publications().findByPk(id)

      if (!publication) throw new CustomError('Not found publication', 404, 'Not Found')

      await publication.destroy({ transaction })

      await transaction.commit()

      return publication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }


}

module.exports = PublicationsServices