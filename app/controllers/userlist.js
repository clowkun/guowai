var azure = require('azure-storage');
var async = require('async');

module.exports = UserList;

UserList.prototype = {

  addUser: function(req,res) {
    var self = this;
    var item = req.body.item;
    self.user.addItem(item, function itemAdded(error) {
      if(error) {
        throw error;
      }
      res.redirect('/');
    });
  },
}
