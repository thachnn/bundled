module.exports = {
  import: function() {
    throw new Error("System.import cannot be used indirectly");
  }
};
