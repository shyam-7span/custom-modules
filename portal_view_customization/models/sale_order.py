from odoo import models, fields,api


class SaleOrder(models.Model):
    _inherit = "sale.order"

  
    country_id = fields.Many2one('res.country', string='Destination Country', help="Select the destination country of the customer.")
