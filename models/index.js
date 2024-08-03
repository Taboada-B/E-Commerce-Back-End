// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category


// Categories have many Products

// Products belongToMany Tags (through ProductTag)

// Tags belongToMany Products (through ProductTag)

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};

// example below 
// const Reader = require('./Reader');
// const LibraryCard = require('./LibraryCard');

// Reader.hasOne(LibraryCard, {
//   foreignKey: 'reader_id',
//   // When we delete a Reader, make sure to also delete the associated Library Card.
//   onDelete: 'CASCADE',
// });

// LibraryCard.belongsTo(Reader, {
//   foreignKey: 'reader_id',
// });

// // We package our two models and export them as an object so we can import them together and use their proper names
// module.exports = { Reader, LibraryCard };