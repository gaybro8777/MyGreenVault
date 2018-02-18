'use strict';

const url = require('url');
const ObjectId = require('mongodb').ObjectID;
const saleQuery = require('../../queries/sale');
const emailService = require('../../services/email');

const emailSubject = 'Latest sale';

exports.add = (req, res) => {
  const userId = req.user.id;
  const sale = req.body.data;
  const emails = req.body.emails;

  if (emails && emails.length > 0) {
    const report = createSaleReport(sale);
    emails.forEach(email => emailService.sendEmail(email, emailSubject, report));
  }

  const saleWithUserId = Object.assign(
    {
      userId: ObjectId(userId)
    },
    sale
  );

  saleQuery
    .add(saleWithUserId)
    .then(newSale => {
      res.status(200).send(newSale._doc);
    })
    .catch(error => {
      res.send(500);
      throw new Error(error);
    });
};


function createSaleReport(sale) {
  return `<div class="invoice-box" style="max-width: 800px;margin: auto;padding: 30px;border: 1px solid #eee;box-shadow: 0 0 10px rgba(0, 0, 0, .15);font-size: 16px;line-height: 24px;font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;color: #555;">
  <table cellpadding="0" cellspacing="0" style="width: 100%;line-height: inherit;text-align: left;">
      <tr class="top">
          <td colspan="2" style="padding: 5px;vertical-align: top;">
              <table style="width: 100%;line-height: inherit;text-align: left;">
                  <tr>
                      <td class="title" style="padding: 5px;vertical-align: top;padding-bottom: 20px;font-size: 45px;line-height: 45px;color: #333;background-color: black;">
                          <img src="https://mygreenvault.com/wp-content/uploads/2017/11/logo-sm.png" style="width:100%; max-width:300px;">
                      </td>
                      
                      <td style="padding: 5px;vertical-align: top;text-align: right;padding-bottom: 20px;">
                          Transaction#: ${sale.objectId}<br>
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
      
      <tr class="information">
          <td colspan="2" style="padding: 5px;vertical-align: top;">
              <table style="width: 100%;line-height: inherit;text-align: left;">
                  <tr>
                      <td style="padding: 5px;vertical-align: top;padding-bottom: 40px;">
                        ${sale.businessName}<br>
                        ${sale.businessAddress}<br>
                        ${sale.businessState}, ${sale.businessCity} ${sale.businessZip}
                      </td>
                      
                      <td style="padding: 5px;vertical-align: top;text-align: right;padding-bottom: 40px;">
                          ${sale.contactName}<br>
                          ${sale.contactEmail}
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
      <tr class="heading">
          <td style="padding: 5px;vertical-align: top;background: #eee;border-bottom: 1px solid #ddd;font-weight: bold;">
              Item Name
          </td>
          <td style="padding: 5px;vertical-align: top;text-align: right;background: #eee;border-bottom: 1px solid #ddd;font-weight: bold;">
              Item Uid
          </td>
          <td style="padding: 5px;vertical-align: top;background: #eee;border-bottom: 1px solid #ddd;font-weight: bold;">
              Item Unit Cost
          </td>
          
          <td style="padding: 5px;vertical-align: top;background: #eee;border-bottom: 1px solid #ddd;font-weight: bold;">
              Total Cost
          </td>
      </tr>
      
      <tr class="item last">
          <td style="padding: 5px;vertical-align: top;border-bottom: none;">
             ${sale.itemName}
          </td>
          <td style="padding: 5px;vertical-align: top;text-align: right;border-bottom: none;">
            ${sale.uidTagNumber}
        </td>
          <td style="padding: 5px;vertical-align: top;border-bottom: none;">
            ${sale.unitCost}
          </td>
          <td style="padding: 5px;vertical-align: top;border-bottom: none;">
            ${sale.totalCost}
          </td>
      </tr>
      
      <tr class="total">
          <td style="padding: 5px;vertical-align: top;"></td>
          
          <td style="padding: 5px;vertical-align: top;text-align: right;border-top: 2px solid #eee;font-weight: bold;">
             Total: ${sale.totalCost}
          </td>
      </tr>
  </table>
</div>`;
}