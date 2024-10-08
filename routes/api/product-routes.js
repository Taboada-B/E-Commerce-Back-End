const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
// api/products


router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          through: ProductTag,
          attributes: ['id', 'tag_name']
        }
      ]
    })
    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json({ message: "Error recieving products" })
  }

});

// get one product
// api/products/id
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'] //
        },
        {
          model: Tag,
          through: ProductTag,
          attributes: ['id', 'tag_name'] //
        }
      ]
    });

    if (!productData) {
      res.status(404).json({ message: 'Product not found' })
      return;
    }
    else {
      res.status(200).json(productData);
    }

  }
  catch (error) {
    res.status(500).json({ message: "Error did not find product with that Id" })
  }

});

// create new product
// api/products
// body   // { 
  //   "product_name": "Basketball",
  //   "price": 200.00,
  //   "stock": 3,
  //   "tagIds": [4]
  // }
// 
router.post('/', (req, res) => {

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
});

// update product

// /api/products/6
// body 
// {
//   "product_name": "Basketball",
//      "price": 200.00,
//      "stock": 3,
//      "tagIds": [ 4]
//  }
 
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

// delete one product by its `id` value
// /api/products/id
router.delete('/:id', async (req, res) => {
  
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });
    res.status(200).json({ message: 'Product deleted successfully' });
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

  } catch (error) {
    console.error(error); // Log the error to the console
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
