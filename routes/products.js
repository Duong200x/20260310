var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
const slugify = require('slugify');

// 1. READ ALL (Lấy tất cả sản phẩm chưa bị xóa)
router.get('/', async function(req, res, next) {
  try {
    let result = await productModel.find({ isDeleted: false }).populate('category');
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 2. READ ONE (Lấy chi tiết 1 sản phẩm theo ID)
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({ _id: id, isDeleted: false }).populate('category');
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "Sản phẩm không tồn tại hoặc đã bị xóa" });
    }
  } catch (error) {
    res.status(500).send({ message: "ID không hợp lệ hoặc lỗi hệ thống" });
  }
});

// 3. CREATE (Thêm sản phẩm mới)
router.post('/', async function(req, res, next) {
  try {
    let { title, price, description, images, category } = req.body;
    let newProduct = new productModel({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      price,
      description,
      images,
      category
    });
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// 4. UPDATE (Cập nhật sản phẩm theo ID)
router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    if (req.body.title) {
        req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedProduct) {
        res.status(200).send(updatedProduct);
    } else {
        res.status(404).send({ message: "Không tìm thấy sản phẩm để cập nhật" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// 5. DELETE (Xóa mềm - set isDeleted = true)
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let deletedProduct = await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (deletedProduct) {
        res.status(200).send({ message: "Xóa thành công", data: deletedProduct });
    } else {
        res.status(404).send({ message: "Không tìm thấy sản phẩm để xóa" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
