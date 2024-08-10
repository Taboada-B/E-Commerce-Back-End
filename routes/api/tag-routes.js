const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, attributes: ['id', 'product_name'] }]
    });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tags' });
  }
});
// /api/tags/id
router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, attributes: ['id', 'product_name'] }]
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tag' });
  }
});

// api/tags
// body {
// "tag_name": "jazz music"
//}
router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ message: 'Error creating tag' });
  }
});
// api/tags/id
// body {
// "tag_name": "hip hop music"
//}
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const [updated] = await Tag.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedTag = await Tag.findByPk(req.params.id);
      res.status(200).json(updatedTag);
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating tag' });
  }
});
// api/tags/id
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleted = await Tag.destroy({
      where: { id: req.params.id }
    });

    if (deleted) {
      res.status(204).end(); // No content to return
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tag' });
  }
});

module.exports = router;
