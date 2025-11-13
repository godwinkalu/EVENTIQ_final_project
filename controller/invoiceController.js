const invoiceModel = require('../models/invoiceModel')
const clientModel = require('../models/clientModel')

exports.getInvoice = async (req, res, next) => {
  try {
    const client = await clientModel.findById(req.user.id)

    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      })
    }

    const invoice = await invoiceModel
      .find({ clientId: client._id })
      .populate('clientId')
      .populate('venueId')
      .populate('venuebookingId')
      .sort({ createdAt: -1 })
    res.status(200).json({
      message: 'Invoice generated successfully',
      data: invoice,
    })
  } catch (error) {
    next(error)
  }
}

exports.getOneInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params
    const invoice = await invoiceModel
      .findOne({
        clientId: client._id,
      })
      .populate('clientId')
      .populate('venueId')
      .populate('venuebookingId')

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice Not Found',
      })
    }

    res.status(200).json({
      message: 'invoice Data',
      data: invoice,
    })
  } catch (error) {
    next(error)
  }
}
