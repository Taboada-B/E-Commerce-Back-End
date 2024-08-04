// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id', // category_id from Products
});
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'categor_id',  // many products connected to category through category_id
});
// Products belongToMany Tags (through ProductTag)
//Establishes a many-to-many relationship where each 
//Product can have multiple Tags and each Tag can be associated with multiple Products 
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
});

// Tags belongToMany Products (through ProductTag)

Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
