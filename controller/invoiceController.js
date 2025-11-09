const invoiceModel = require('../models/invoiceModel');
const clientModel = require('../models/clientModel');


exports.getInvoice = async (req, res, next) => {
  try {
    const client = await clientModel.findById(req.user.id);

    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      })
    }

    const invoice = await invoiceModel.find({clientId: client._id})
    res.status(200).json({
      message: 'Invoice generated successfully',
      data: invoice
    })
  } catch (error) {
    next(error)
  }
}

exports.getOneInvoice = async (req ,res,next) =>{
 try {
  const {id} = req.params
  const client = await clientModel.findById(req.user.id)
  
  const Invoice = await invoiceModel.findById(id)
  if (!Invoice) {
    return res.status(404).json({
      message: 'Invoice Not Found'
    })
  }
  if (!client) {
    return res.status(404).json({
      message: 'Client Not Found'
    })
  }
  res.status(200).json({
    message:'Invoice Data',
    data: Invoice
  })
  
 } catch (error) {
  next(error)
 }
}